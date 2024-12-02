export function HorizontalToolbarStyles () {
  const styles: CustomizeStylesRes = {
    HorizontalToolbar: {
      name: 'HorizontalToolbar',
      css: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
      }
    },

    HorizontalToolbarWrapper: {
      name: 'HorizontalToolbarWrapper',
      css: {
        width: '100%',
        margin: '14px 3%',
        backgroundColor: '#ededed',
        opacity: '.7',
        padding: '0.6rem',
        borderRadius: '4px',
      }
    },

    HorizontalToolbarButtons: {
      name: 'HorizontalToolbarButtons',
      css: {
        width: '100%',
      }
    },
    HorizontalToolbarButtonsWp: {
      name: 'HorizontalToolbarButtonsWp',
      css: {
        width: '100%',
      }
    },
    HorizontalToolbarButton: {
      name: 'HorizontalToolbarButton',
      css: {
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
      }
    },
    HorizontalToolbarButtonUp: {
      name: 'HorizontalToolbarButtonUp',
      css: {

      }
    },
    HorizontalToolbarButtonDown: {
      name: 'HorizontalToolbarButtonDown',
      css: {

      }
    },
    HorizontalToolbarButtonLabel: {
      name: 'HorizontalToolbarButtonLabel',
      css: {

      }
    },
    
  }

  return styles
}

interface CustomizeStylesRes {
  [key: string]: {
    name: string
    css: React.CSSProperties
  }
}
export interface CustomizeStylesFnParams {

}
export type CustomizeStylesFn = (params?: CustomizeStylesFnParams) => CustomizeStylesRes