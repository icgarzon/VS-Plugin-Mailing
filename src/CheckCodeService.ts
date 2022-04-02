import { window } from "vscode";
//const jsdom = require("jsdom");
//const { JSDOM } = jsdom;


export class CheckCodeService {

  private countErrors: number;
  private codeHtml: string;

  constructor(params:{ html:string }) {
    this.countErrors = 0;
    this.codeHtml = params?.html;
  }

  /*public async checkSintaxys(): Promise<void>{

    this.verifyImg()
    .then(()=>{ this.verifyIds(); })
    .then(()=>{ this.verifyStyles(); })
    .then(()=>{ this.verifyTables(); })
    .then(()=>{ this.verifyLinks(); })
    .then(()=>{ this.verifyEntity(); })
    .then(()=>{ this.verifyHtmlMsO(); })
    .then(()=>{ this.verifyTrAttributes(); })
    .then(()=>{ this.verifyHeaders(); })
    .then(()=>{
      if( this.countErrors === 0){
        window.showInformationMessage(`Your code looks amazing 👍`);
      }
    });

  }

  private addItem = (params:{ text:string, total?:number })=>{
    window.showErrorMessage(`${ params.total && params?.total > 0 ? '('+params?.total+') ' : ' ' }${params?.text}`); this.countErrors++;
  };

  private async verifyImg (): Promise<void>{
  
    await new Promise((resolve, reject) => {
      
      try {

        if(this.codeHtml){
          
          const doc = new JSDOM(this.codeHtml)?.window?.document,
                imgs = doc?.querySelectorAll('img'),
                imgsAlt = this.codeHtml?.match(/<img [^>]*src="[^"]*"[^>]*>/gm);

          // Verify if has alt value
          if(imgs){
            imgs.forEach((img: { getAttribute: (arg0: string) => any; }) => { console.log( img );
                if(img){
                  var altValue = img?.getAttribute('alt'),
                      srcValue = img?.getAttribute('src'),
                      borderValue = img?.getAttribute('border'),
                      styleValue = img?.getAttribute('style'),
                      styleValueDisplay = styleValue?.match(/display:/gm);

                  if(!altValue){ this.addItem({ text:`${ srcValue } has not (alt) value` }); }
                  if(!borderValue){ this.addItem({ text:`${ srcValue } has not (border="0")` }); }
                  if(!styleValueDisplay || styleValueDisplay.length < 1){ this.addItem({ text:`${ srcValue } has not (display) property` }); }
                }
            });
          }

          // Verify if has alt duplicated
          if(imgsAlt){
            imgsAlt.forEach(img => { console.log( img );
              let altattr = img?.match(/alt=/gm), count = 0;
              if(altattr && altattr.length > 1){ count++; }
              if(count>0){ this.addItem({ text: `There are images with (alt) attribute duplicated` }); }
            });
          }

        }

        resolve(true);

      }catch(error){

        reject(error);
        
      }

    });

  };

  private async verifyStyles (): Promise<void>{
  
    await new Promise((resolve, reject) => {
      
      try {

        const str = this.codeHtml,
              doc = new JSDOM(this.codeHtml)?.window?.document,
              common = doc.querySelectorAll('table,tr,td,img,div,li,ul,a');

        if(common){

          var textAlignCount=0, marginCount=0;

          common.forEach((code: { getAttribute: (arg0: string) => any; }) => {

            if(code){

              let styleValue = code?.getAttribute('style'), 
                  talgn = styleValue?.match(/text-align/gm), 
                  mrgn = styleValue?.match(/margin/gm);

              if(talgn && talgn?.length > 0){ textAlignCount++; }
              if(mrgn && mrgn?.length > 0){ marginCount++; }

            }

          });

          if(textAlignCount > 0){ this.addItem({ text:`There are (text-align) properties in style code`, total:textAlignCount }); }
          if(marginCount > 0){ this.addItem({ text:`There are (margin) properties in style code`, total:marginCount }); }

        }

        resolve(true);

      }catch(error){
        reject(error);
      }

    });
    
  };
  

  private async verifyIds (): Promise<void>{
    
    await new Promise((resolve, reject) => {
      try {
        const str = this.codeHtml, talgn = str?.match(/ id="/gm);
        if(talgn && talgn?.length > 0){ this.addItem({ text:`There are (id) properties in code`, total:talgn.length }); }
        resolve(true);
      }catch(error){ 
        reject(error);
      }
    });
    
  }

  private async verifyTables (): Promise<void>{
    
    await new Promise((resolve, reject) => {
      
      try {

        const str = this.codeHtml,
              doc = new JSDOM(this.codeHtml)?.window?.document,
              tables = doc.querySelectorAll('table');

        // Verify if has basic properties
        if(tables){
          let count = 0;
          tables.forEach((table: { getAttribute: (arg0: string) => any; }) => {
              let border = table.getAttribute('border'), cellpadding = table.getAttribute('cellpadding'), cellspacing = table.getAttribute('cellspacing');
              if(!border || !cellpadding || !cellspacing){ count++; }
          });
          if(count > 0){ this.addItem({ text:`There are tables without (basic(border,cellpadding,cellspacing)) attributes`, total:count }); }
        }

        resolve(true);

      }catch(error){
          
        reject(error);

      }

    });

  }

  private async verifyLinks (): Promise<void>{
    
    await new Promise((resolve, reject) => {
      
      try {

        const str = this.codeHtml,
              doc = new JSDOM(this.codeHtml)?.window?.document,
              links = doc.querySelectorAll('a');

        // Verify href empty
        if(links){
          links.forEach((link: { getAttribute: (arg0: string) => any; }) => {
              let hrefValue = link.getAttribute('href');
              if(!hrefValue){ this.addItem({ text:`It has links (<a>) with (href) value empty` }); }
          });
        }

        resolve(true);

      }catch(error){
        reject(error);
      }

    });

  }

  private async verifyEntity (): Promise<void>{
    
    await new Promise((resolve, reject) => {
      try {
        const str = this.codeHtml, 
              rsquo = str?.match(/’/gm);
        if(rsquo && rsquo?.length > 0){ this.addItem({ text:`You can change ( ’ ) for &rsquo;`, total:rsquo.length }); }
        resolve(true);
      }catch(error){ 
        reject(error);
      }
    });
    
  }
  
  private async verifyHtmlMsO (): Promise<void>{
    
    await new Promise((resolve, reject) => {
      try {
        const str = this.codeHtml, 
              msoschema = str?.match(/urn:schemas-microsoft-com:office:office/gm);
        if(msoschema?.length === 0 || !msoschema){ this.addItem({ text:`Add the MS tags in the html tag for prevent global button problems` }); }
        resolve(true);
      }catch(error){ 
        reject(error);
      }
    });
    
  }
  
  private async verifyTrAttributes (): Promise<void>{
    
    await new Promise((resolve, reject) => {
      
      try {

        const str = this.codeHtml,
              doc = new JSDOM(this.codeHtml)?.window?.document,
              rows = doc.querySelectorAll('tr');

        if(rows){
          rows.forEach((row: { getAttribute: (arg0: string) => any; }) => {
              let styleValue = row.getAttribute('style');
              if(styleValue){ this.addItem({ text:`It has properties (<tr>) with (style), review CRM Developer Best Practices.` }); }
          });
        }

        resolve(true);

      }catch(error){
        reject(error);
      }

    });

  }
  
  private async verifyHeaders (): Promise<void>{
    
    await new Promise((resolve, reject) => {
      
      try {

        const str = this.codeHtml,
              doc = new JSDOM(this.codeHtml)?.window?.document,
              headers = doc.querySelectorAll('h1,h2,h3,h4,h5,h6');

        if(headers?.length > 0){
          this.addItem({ text:`There are headers tags (h1-h6), review CRM Developer Best Practices.`, total:headers.length });
        }

        resolve(true);

      }catch(error){
        reject(error);
      }

    });

  }*/

};