'use strict';

const debug = require('debug')('script');
const request = require('request');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const ROOT_CATEGORIES = [
    { name: 'entertainment', id: 'Q173799' },
    { name: 'art', id: 'Q735' },
    { name: 'politics', id: 'Q7163' },
    { name: 'economics', id: 'Q8134' },
    { name: 'sport', id: 'Q349' },
    { name: 'jurisprudence', id: 'Q4932206' },
    { name: 'science', id: 'Q336' },
    { name: 'entrepreneurship', id: 'Q3908516' }
];

let OCCUPATIONS = {};
const CATEGORIES = {};

function exploreSubcategories(category, parentId, loopCount) {
    debug('eploring category:', category.name);
    loopCount = loopCount || 0;
    let cat = CATEGORIES[category.id];
    if (cat) {
        debug('explored category', category.name);
        if (parentId && cat.parents.indexOf(parentId) < 0) {
            cat.parents.push(parentId);
        }
        return;
    }
    cat = CATEGORIES[category.id] = { name: category.name };
    if (parentId) {
        cat.parents = cat.parents || [];
        cat.parents.push(parentId);
    }

    if (loopCount >= 5) {
        return;
    }

    // 1 get subclasses
    return querySubclass(category).then(subcategories => {
        // console.log('subcategories', subcategories);
        if (subcategories.length) {
            // subcategories = subcategories.filter(subcategory => !ALL_OCCUPATIONS[subcategory.id]);
            cat.childs = subcategories.map(sc => sc.id);
            return Promise.each(subcategories, subcategory => exploreSubcategories(subcategory, category.id, loopCount + 1));
        }
    });
}

function initData() {
    return queryProfessions().then(professions => {
        return saveFile(professions, 'professions');
    });
}

function buildResult() {

    return initData().then(function () {

        // return queryOccupations().then(occupations => {
        // OCCUPATIONS = occupations;
        return Promise.each(ROOT_CATEGORIES, function (category) {
            return exploreSubcategories(category);
        });
        // });
    }).then(() => CATEGORIES);
}

function saveResult(result) {
    try {
        fs.writeFileSync(path.join(__dirname, '../data/categories.json'), JSON.stringify(result), { encoding: 'utf8' });
    } catch (e) {
        return Promise.reject(e);
    }
    return Promise.resolve();
}

function saveFile(result, name) {
    try {
        fs.writeFileSync(path.join(__dirname, '../data/' + name + '.json'), JSON.stringify(result), { encoding: 'utf8' });
    } catch (e) {
        return Promise.reject(e);
    }
    return Promise.resolve();
}

function run() {
    return buildResult().then(saveResult);
}

run()
    .then(function () {
        console.log('OK');
    })
    .catch(function (error) {
        console.error(error);
    });

function getOccupation(id) {
    return OCCUPATIONS[id];
}

function wikidataQuery(query, keys) {
    return new Promise(function (resolve, reject) {
        request({
            url: 'https://query.wikidata.org/bigdata/namespace/wdq/sparql',
            method: 'GET',
            qs: {
                query: query
            },
            json: true
        }, function (error, response, json) {
            if (error) {
                return reject(error);
            }
            if (!json.results || !json.results.bindings || !json.results.bindings.length) {
                // console.log('result is null', json);
                return resolve([]);
            }

            const ids = json.results.bindings.filter(it => {
                for (var i = 0; i < keys.length; i++) {
                    if (!it[keys[i]] || !it[keys[i]].value) {
                        return false;
                    }
                }
                return true;
            }).map(it => {
                const data = {};
                for (var i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const value = data[key] = it[key].value;
                    if (typeof value === 'string' && value.indexOf('/entity/') > 0) {
                        data[key] = value.substr(value.indexOf('/entity/') + 8);
                    }
                }

                return data;
            });

            resolve(ids);
        });
    });
}

function querySubclass(category) {
    return wikidataQuery(`SELECT DISTINCT ?item ?itemLabel WHERE {
  ?item wdt:P279 wd:${category.id}.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY ?item
LIMIT 2000`, ['item', 'itemLabel'])
        .then(items => {
            // console.log('items', items);
            items = items.filter(item => !isWikiId(item.itemLabel));
            return items.map(item => { return { id: item.item, name: item.itemLabel } });
        });
}

function queryOccupations() {
    return wikidataQuery(`SELECT DISTINCT ?occupation ?occupationLabel
WHERE
{
	?item wdt:P425 ?occupation .
    SERVICE wikibase:label {
		bd:serviceParam wikibase:language "en" 
	}
}
limit 2000`, ['occupation', 'occupationLabel'])
        .then(items => {
            const data = {};
            items.forEach(item => {
                if (!isWikiId(item.occupationLabel)) {
                    data[item.occupation] = item.occupationLabel;
                }
            });

            return data;
        });
}

function queryProfessions() {
    return wikidataQuery(`SELECT DISTINCT ?item
WHERE
{
	?item wdt:P31 wd:Q28640 .
}
limit 5000`, ['item'])
        .then(items => {
            return items.map(item => item.item);
        });
}

function isWikiId(id) {
    return /^Q\d+$/.test(id);
}
