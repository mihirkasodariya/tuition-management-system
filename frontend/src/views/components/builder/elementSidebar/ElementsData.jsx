import {
  Image,
  RectangleEllipsis,
  SquareSplitVertical,
  TextSelectionIcon,
  LetterText,
  Video,
} from 'lucide-react';

export default [
  {
    icon: RectangleEllipsis,
    label: 'Button',
    type: 'button',
    content: 'Sample Button',
    url: '#',
    styleClass: '', //text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5
    style: {
      color: '#fff',
      backgroundColor: '#1f2937',
      fontWeight: 500,
      borderRadius: '8px', // 0.5rem = 8px
      fontSize: '14px', // 0.875rem = 14px
      paddingLeft: '20px', // 1.25rem = 20px
      paddingRight: '20px', // 1.25rem = 20px
      paddingTop: '10px', // 0.625rem = 10px
      paddingBottom: '10px', // 0.625rem = 10px
      outline: 'none',
    },
    outerStyle: {},
  },
  {
    icon: TextSelectionIcon,
    type: 'text',
    label: 'Text',
    content: 'Sample Text',
    styleClass: '',
    style: {
      fontSize: '16px',
      color: '#111827',
      backgroundColor: '#fffff',
      fontWeight: 400,
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: '0px',
      paddingBottom: '0px',
    },
    outerStyle: {},
  },
  {
    icon: LetterText,
    type: 'editor',
    label: 'Text Editor',
    content: 'Sample Text',
    styleClass: '',
    style: {},
    outerStyle: {},
  },
  {
    icon: Image,
    type: 'image',
    label: 'Image',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwRConBYl2t6L8QMOAQqa5FDmPB_bg7EnGA&s',
    alt: 'Image',
    url: '#',
    styleClass: '',
    style: {
      height: 'auto',
      width: '100%',
      borderRadius: '8px',
      marginLeft: '0px',
      marginRight: '0px',
      marginTop: '0px',
      marginBottom: '0px',
    },
    outerStyle: {},
  },
  {
    icon: SquareSplitVertical,
    type: 'divider',
    label: 'Divider',
    content: '',
    styleClass: '',
    style: {
      borderColor: '#000',
      borderStyle: 'solid',
      borderTopWidth: '1px',
      width: '100%',
      marginTop: '5px',
      marginBottom: '5px',
    },
    outerStyle: {
      alignItems: 'center',
    },
  },
  {
    icon: Video,
    type: 'video',
    label: 'Video',
    videoUrl: 'https://youtu.be/HAnw168huqA?si=6KpACX_Luo9UHrQ_',
    style: {
      width: '640px',
      height: '360px',
      marginTop: '5px',
      marginBottom: '5px',
    },
  },

  // {
  //   icon: Frame,
  //   type: 'logo',
  //   label: 'Logo',
  //   imageUrl: '/logo.svg',
  //   alt: 'logo',
  //   url: '#',
  //   style: {
  //     backgroundColor: '#ffffff',
  //     padding: '10px',
  //     height: '30%',
  //     width: '30%',
  //   },
  //   outerStyle: {
  //     display: 'flex',
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     backgroundColor: '#fff',
  //     width: '100%',
  //   },
  // },
  // {
  //   icon: PanelTop,
  //   type: 'LogoHeader',
  //   label: 'Logo Header',
  //   imageUrl: '/logo.svg',
  //   alt: 'logo',
  //   url: '#',
  //   style: {
  //     backgroundColor: '#ffffff',
  //     padding: '10px',
  //     height: '40%',
  //     width: '40%',
  //   },
  //   outerStyle: {
  //     display: 'flex',
  //     justifyContent: 'left',
  //     alignItems: 'center',
  //     backgroundColor: '#fff',
  //     width: '100%',
  //   },
  // },

  // {
  //   type: 'SocialIcons',
  //   icon: Twitter,
  //   label: 'Social Icons',
  //   socialIcons: [
  //     {
  //       icon: 'https://cdn-icons-png.flaticon.com/128/2111/2111463.png',
  //       url: '',
  //     },
  //     {
  //       icon: 'https://cdn-icons-png.flaticon.com/128/5968/5968852.png',
  //       url: '',
  //     },
  //     {
  //       icon: 'https://cdn-icons-png.flaticon.com/128/5968/5968756.png',
  //       url: '',
  //     },
  //   ],
  //   options: [
  //     {
  //       icon: 'https://cdn-icons-png.flaticon.com/128/2111/2111463.png',
  //       url: '',
  //     },
  //     {
  //       icon: 'https://cdn-icons-png.flaticon.com/128/5968/5968852.png',
  //       url: '',
  //     },
  //     {
  //       icon: 'https://cdn-icons-png.flaticon.com/128/5968/5968756.png',
  //       url: '',
  //     },
  //   ],
  //   style: {
  //     width: 40,
  //     height: 40,
  //   },
  //   outerStyle: {
  //     display: 'flex',
  //     gap: 15,
  //   },
  // },
];
