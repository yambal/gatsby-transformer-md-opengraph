# gatsby-transformer-md-opengraph

```
query MyQuery {
  allMarkdownRemark {
    nodes {
      frontmatter {
        title
      }
      children {
        ... on Opengraph {
          id
          og {
            title
            mdTitle
            mdUrl
            description
            image {
              url
            }
          }
        }
      }
    }
  }
}

```