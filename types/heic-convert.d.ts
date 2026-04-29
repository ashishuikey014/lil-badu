declare module "heic-convert" {
  interface Options {
    buffer: Buffer | ArrayBuffer | Uint8Array;
    format: "JPEG" | "PNG";
    quality?: number;
  }
  function heicConvert(options: Options): Promise<ArrayBuffer>;
  export = heicConvert;
}
