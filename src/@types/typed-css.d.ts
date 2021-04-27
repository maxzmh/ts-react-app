/**
 * 声明资源文件的module
 * 避免引用import资源文件的时候报错
 * 'TS2307 Cannot find module'
 */

declare module '*.less';
declare module '*.css';
declare module '*.json';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

declare module '*.svg' {
    const content: any;
    export default content;
}
