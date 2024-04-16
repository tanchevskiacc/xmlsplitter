This is a simple XML splitter that using [xml2js] (https://www.npmjs.com/package/xml2js) library

## Getting Started

Navigate to your preffered directory and download the repo. Then run the command

```bash
npm install
```

Once your dependecies are installed then run the following command:

```bash
npm run xmlsplit filepath=catalog.xml byattr=product bytag=product-id
```

Note that catalog.xml is stored in the IMPEX/import directory. You do not need to provide the full path of your input file. Then the single generated files will be exported in IMPEX/export