import React, { useCallback, useMemo } from 'react'
import { FormatBold, FormatItalic, FormatUnderlined, Code, LooksOne, LooksTwo, FormatQuote, FormatListBulleted, FormatListNumbered } from '@material-ui/icons'
import isHotkey from 'is-hotkey'
// Import the Slate editor factory.
import { createEditor, Editor, Transforms, Element as SlateElement } from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact, useSlate } from 'slate-react'
import { withHistory } from 'slate-history'

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const TextEditor = () => {
    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback(props => <Leaf {...props} />, [])
    const editor = useMemo(() => withHistory(withReact(createEditor())), [])

    const initialValue = [
        {
          type: 'paragraph',
          children: [
            { text: 'This is editable ' },
            { text: 'rich', bold: true },
            { text: ' text, ' },
            { text: 'much', italic: true },
            { text: ' better than a ' },
            { text: '<textarea>', code: true },
            { text: '!' },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              text:
                "Since it's rich text, you can do things like turn a selection of text ",
            },
            { text: 'bold', bold: true },
            {
              text:
                ', or add a semantically rendered block quote in the middle of the page, like this:',
            },
          ],
        },
        {
          type: 'block-quote',
          children: [{ text: 'A wise quote.' }],
        },
        {
          type: 'paragraph',
          align: 'center',
          children: [{ text: 'Try it out for yourself!' }],
        },
      ]

    // Render the Slate context.
    return (
        <Slate editor={editor} value={initialValue} >
            <div>
                <MarkButton format="bold" icon="FormatBold" />
                <MarkButton format="italic" icon="FormatItalic" />
                <MarkButton format="underline" icon="FormatUnderlined" />
                <MarkButton format="code" icon="Code" />
                <BlockButton format="heading-one" icon="LooksOne" />
                <BlockButton format="heading-two" icon="LooksTwo" />
                <BlockButton format="block-quote" icon="FormatQuote" />
                <BlockButton format="numbered-list" icon="FormatListNumbered" />
                <BlockButton format="bulleted-list" icon="FormatListBulleted" />
            </div>
            <Editable

                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Enter some rich text…"
                spellCheck
                autoFocus

                onKeyDown={event => {
                    for (const hotkey in HOTKEYS) {
                      if (isHotkey(hotkey, event)) {
                        event.preventDefault()
                        const mark = HOTKEYS[hotkey]
                        toggleMark(editor, mark)
                      }
                    }
                }}

            />
        </Slate>
    )
}


// Toggle Mark ------------------------------------------------------------

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)
  
    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
}

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

// ------------------------------------------------------------------------


// Toggle Block -----------------------------------------------------------

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(
      editor,
      format,
      TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
    )
    const isList = LIST_TYPES.includes(format)
  
    Transforms.unwrapNodes(editor, {
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        LIST_TYPES.includes(n.type) &&
        !TEXT_ALIGN_TYPES.includes(format),
      split: true,
    })
    let newProperties;
    if (TEXT_ALIGN_TYPES.includes(format)) {
      newProperties = {
        align: isActive ? undefined : format,
      }
    } else {
      newProperties = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format,
      }
    }
    Transforms.setNodes(editor, newProperties)
  
    if (!isActive && isList) {
      const block = { type: format, children: [] }
      Transforms.wrapNodes(editor, block)
    }
}

const isBlockActive = (editor, format, blockType = 'type') => {
    const { selection } = editor
    if (!selection) return false
  
    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n[blockType] === format,
      })
    )
  
    return !!match

}

// -----------------------------------------------------------------------

// BLOCk button -----------------------------------------------------------

const BlockButton = ({ format, icon }) => {
    const editor = useSlate();

    let Muicon;

    switch(icon){
        case LooksOne:
          Muicon = <LooksOne/>
        break;
        case LooksTwo:
          Muicon = <LooksTwo/>
        break;
        case FormatQuote:
          Muicon = <FormatQuote/>
        break;
        case FormatListBulleted:
          Muicon = <FormatListBulleted/>
        break;
        case FormatListNumbered:
          Muicon = <FormatListNumbered/>
        break;
        default:

    }

    return (
      <button
        active={isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
        )}
        onMouseDown={event => {
          event.preventDefault()
          toggleBlock(editor, format)
        }}
      >
        {Muicon}
      </button>
    )
  }

const MarkButton = ({ format, icon }) => {
    const editor = useSlate();

    let Muicon = () =>{

    switch(icon) {
        case FormatBold:
          return <FormatBold/>
        case FormatItalic:
          return <FormatItalic/>
        case FormatUnderlined:
          return <FormatUnderlined/>
        case Code:
          return <Code/>
        default:

            return icon
    }
}

    return (
      <button
        active={isMarkActive(editor, format)}
        onMouseDown={event => {
          event.preventDefault()
          toggleMark(editor, format)
        }}
      >
        <Muicon/>
      </button>
    )
  }

//   ----------------------------------------------------------------------------

//   Element tag ----------------------------------------------------------------

const Element = ({ attributes, children, element }) => {
    const style = { textAlign: element.align }
    switch (element.type) {
      case 'block-quote':
        return (
          <blockquote style={style} {...attributes}>
            {children}
          </blockquote>
        )
      case 'bulleted-list':
        return (
          <ul style={style} {...attributes}>
            {children}
          </ul>
        )
      case 'heading-one':
        return (
          <h1 style={style} {...attributes}>
            {children}
          </h1>
        )
      case 'heading-two':
        return (
          <h2 style={style} {...attributes}>
            {children}
          </h2>
        )
      case 'list-item':
        return (
          <li style={style} {...attributes}>
            {children}
          </li>
        )
      case 'numbered-list':
        return (
          <ol style={style} {...attributes}>
            {children}
          </ol>
        )
      default:
        return (
          <p style={style} {...attributes}>
            {children}
          </p>
        )
    }
}

// --------------------------------------------------------------------------------------

// Leaf ---------------------------------------------------------------------------------

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
      children = <strong>{children}</strong>
    }
  
    if (leaf.code) {
      children = <code>{children}</code>
    }
  
    if (leaf.italic) {
      children = <em>{children}</em>
    }
  
    if (leaf.underline) {
      children = <u>{children}</u>
    }
  
    return <span {...attributes}>{children}</span>
}

// --------------------------------------------------------------------------------------




export default TextEditor