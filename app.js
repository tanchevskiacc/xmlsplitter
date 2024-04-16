'use strict';

var path = require('path'),
    fs = require('fs'),
    xml2js = require('xml2js');

const { getParamValue } = require('./utils/helper.js');

// define ENV variables
const ENV_IMPEX = 'IMPEX';
const ENV_IMPORT_DIR = 'import';
const ENV_EXPORT_DIR = 'export';

// Export params
const [ , filepath, byattr, bytag ] = process.argv;

const params = {
    getFilePath: () => {
        const absFilePath = getParamValue(filepath);
        return path.join(__dirname, ENV_IMPEX, ENV_IMPORT_DIR, absFilePath);
    },
    getByAttr: () => {
        return getParamValue(byattr);
    },
    getFileName: () => {
        return getParamValue(bytag)
    }
}

/**
 * 
 * @param {object} template catalog data in JSON format
 * @param {object} productData product data in JSON format
 * @returns 
 */
function generateProductXml(template, productData) {
    template[params.getByAttr()] = productData;

    var builder = new xml2js.Builder({
        rootName: 'catalog'
    });

    return builder.buildObject(template);
}

/**
 * 
 * @param {string} file file name with extension 
 * @param {string} fileData file data in xml format 
 */
function exportFile(file, fileData) {
    const exportFilePath = path.join(__dirname, ENV_IMPEX, ENV_EXPORT_DIR, file);

    fs.writeFile(exportFilePath, fileData, function (err) {
        if (err) {
            console.error(`Error with exporting file: ${file}`)
        } else {
            console.log(`Exporting new file: ${exportFilePath} \n`);
        }
    })
}

/**
 * It contains everything except the passed attribute
 * 
 * @param {object} catalog catalog data in JSON type
 * @returns 
 */
function createTemplate(catalog) {
    var template = catalog;
    delete template[params.getByAttr()];
    return template;
}


/**
 * Run the logic
 * 
 * @returns 
 */
function execute() {
    try {
        var filePath = params.getFilePath();
    
        if (!fs.existsSync(filePath)) {
            console.error('Error: There is no such a file');
            return;
        }

        console.info(`Starting reading file: ${filePath} \n`);
    
        fs.readFile(filePath, function (err, data) {
            xml2js.parseString(data, function (err, result) {
                var products = result.catalog[params.getByAttr()];
                var template = createTemplate(result.catalog);
    
                products.forEach(function (product) {
                    exportFile(product['$'][params.getFileName()] + '.xml', generateProductXml(template, product))
                });
            });
        });
    } catch (e) {
        console.error(e)
    }
    
}

module.exports = { execute }