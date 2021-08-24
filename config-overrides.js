const { override,fixBabelImports,addLessLoader } = require("customize-cra");
    
module.exports = override(
  fixBabelImports("importpc", {
    libraryName: "antd", libraryDirectory: "es", style: true // change importing css to less
  }),
  fixBabelImports('importmobile', {
    libraryName: 'antd-mobile', style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      //PC
      "@primary-color": "#1DA57A",
      "@btn-font-weight":"bolder",
      "@table-border-radius-base": "10px",
      "@table-header-bg":"rgb(81, 183, 236)",
      //APP
      "@brand-primary":"#1DA57A",
      "@primary-button-fill":"#024287",
    }
  })
);