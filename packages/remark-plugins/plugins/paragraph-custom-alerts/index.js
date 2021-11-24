import { visit } from 'unist-util-visit'
import { is } from 'unist-util-is'
import { u } from 'unist-builder'

const sigils = {
  '=>': 'success',
  '->': 'info',
  '~>': 'warning',
  '!>': 'danger',
}

function generateAlertElement({ format, type, children }) {
  switch (format) {
    case 'html': {
      return {
        type: 'html',
        children: [children],
        data: {
          hName: 'div',
          hProperties: {
            className: ['alert', `alert-${type}`, 'g-type-body'],
          },
        },
      }
    }
    default:
    case 'jsx': {
      return u(
        'mdxJsxFlowElement',
        {
          name: 'div',
          attributes: [
            u(
              'mdxJsxAttribute',
              { name: 'className' },
              `alert alert-${type} g-type-body`
            ),
          ],
        },
        [children]
      )
    }
  }
}

export default function paragraphCustomAlertsPlugin({
  outputFormat = 'jsx',
} = {}) {
  return function transformer(tree) {
    visit(tree, 'paragraph', (pNode, _, parent) => {
      let prevTextNode
      visit(pNode, 'text', (textNode) => {
        Object.keys(sigils).forEach((symbol) => {
          // If this content has already been run through remark, -> will get escaped to \->
          // and split into multiple text nodes, so we need to check for that
          const isEscapedInfo =
            symbol === '->' &&
            prevTextNode?.value === '-' &&
            textNode.value.startsWith('> ')

          if (textNode.value.startsWith(`${symbol} `) || isEscapedInfo) {
            // Remove the literal sigil symbol from string contents
            if (isEscapedInfo) {
              prevTextNode.value = ''
              textNode.value = textNode.value.replace('> ', '')
            } else {
              textNode.value = textNode.value.replace(`${symbol} `, '')
            }

            // Wrap matched nodes with <div> (containing proper attributes)
            parent.children = parent.children.map((node) => {
              return is(pNode, node)
                ? generateAlertElement({
                    format: outputFormat,
                    type: sigils[symbol],
                    children: node,
                  })
                : node
            })
          }
        })
        prevTextNode = textNode
      })
    })
  }
}
