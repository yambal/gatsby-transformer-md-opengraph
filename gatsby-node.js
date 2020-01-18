// https://github.com/mikegajda/gatsby-transformer-open-graph/blob/master/gatsby-node.js
var ogs = require('open-graph-scraper');
const crypto = require(`crypto`);

const getOg = (url) => {
  return new Promise(function(resolve) {
    var options = {'url': url};
    ogs(options)
      .then(function (result) {
        //console.log('result:', result);
        resolve(result)
      })
      .catch(function (error) {
        //console.log('error:', error);
      });
  })
}

const createContentDigest = obj => crypto.createHash(`md5`).update(JSON.stringify(obj)).digest(`hex`);

exports.onCreateNode = async ({
  node,
  actions,
  store,
  cache,
  createNodeId
}) => {
  const { createNode, createParentChildLink } = actions
  if (node.internal.type === `MarkdownRemark`) {
    /** Markdown からURLを検索する */
    const ogNodes = []
    const frontmatterJsonString = JSON.stringify(node.frontmatter, null, 2)
    const regex1 = /\[([^\]\{\}\n\r\t"]+)\]\(([^)]+)\)/g
    while ((found = regex1.exec(frontmatterJsonString)) !== null) {
      const og = await getOg(found[2])
      ogNodes.push({
        mdTitle: found[1],
        mdUrl: found[2],
        description: og.data.ogDescription,
        title: og.data.ogTitle,
        image: og.data.ogImage
      }) 
    }

    console.group('open-graph')
    console.info(ogNodes)
    console.groupEnd()

    const addNode = {
      id: createNodeId(`${node} >>> ${found}`),
      parent: node.id,
      children: [],
      internal: {
        type: `Opengraph`
      },
      og: ogNodes
    }
    addNode.internal.contentDigest = createContentDigest(addNode)
    
    createNode(addNode);
    createParentChildLink({
      parent: node,
      child: addNode
    });

    return addNode;
  }
}