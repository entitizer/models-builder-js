'use strict';

const EntityBuilder = require('../lib').Entity;
const wikiEntity = require('wiki-entity');
const assert = require('assert');

describe('EntityBuilder', function () {
    it('fromWikiEntity en:simple', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q18548924', claims: 'none', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = EntityBuilder.fromWikiEntity(entities[0], lang);
                assert.equal('Adrian Ursu', entity.name);
                assert.equal('Q18548924', entity.wikiId);
                assert.equal('H', entity.type);

                // console.log(entity.toJSON());
            });
    });
    it('fromWikiEntity ro:simple', function () {
        const lang = 'ro';
        return wikiEntity.getEntities({ language: lang, ids: 'Q18548924', claims: 'none', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = EntityBuilder.fromWikiEntity(entities[0], lang);
                assert.equal('Adrian Ursu', entity.name);
                assert.equal('Q18548924', entity.wikiId);
                assert.equal('Adrian Ursu (cântăreț)', entity.wikiTitle);
                assert.equal('H', entity.type);

                // console.log(entity.toJSON());
            });
    });
    it('fromWikiEntity Albert Einstein: birth, death dates', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q937', claims: 'all', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = EntityBuilder.fromWikiEntity(entities[0], lang);
                assert.equal('Albert Einstein', entity.name);
                assert.equal('Q937', entity.wikiId);
                assert.equal('H', entity.type);
                assert.equal('Q5', entity.data.P31[0].value);
                assert.equal('1879-03-14', entity.data.P569[0].value);

                // console.log(entity.toJSON().data);
            });
    });
    it('fromWikiEntity Ștefan cel Mare (unknown dates)', function () {
        const lang = 'ro';
        return wikiEntity.getEntities({ language: lang, titles: 'Ștefan cel Mare', claims: 'item', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = EntityBuilder.fromWikiEntity(entities[0], lang);
                assert.equal('Ștefan cel Mare', entity.name);
                assert.equal('H', entity.type);
                // human
                assert.equal('Q5', entity.data.P31[0].value);
                // birth date
                assert.equal('1429', entity.data.P569[0].value);
                // has english wiki title
                assert.ok(entity.enWikiTitle);

                // console.log(entity.toJSON().data);
            });
    });
    it('fromWikiEntity IPhone 5 Product', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q61504', claims: 'all', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = EntityBuilder.fromWikiEntity(entities[0], lang);
                assert.equal('iPhone 5', entity.name);
                // product
                assert.equal('P', entity.type);

                // console.log(entity.toJSON());
            });
    });
    it('fromWikiEntity Chisinau Location data', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q21197', claims: 'all', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = EntityBuilder.fromWikiEntity(entities[0], lang);
                assert.equal('Chișinău', entity.name);
                // Location
                assert.equal('L', entity.type);

                // console.log(entity.data);
            });
    });

    it('fromWikiEntity Facebook Organisation data', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q380', claims: 'all', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = EntityBuilder.fromWikiEntity(entities[0], lang);
                assert.equal('Facebook Inc.', entity.name);
                // Organisation
                assert.equal('O', entity.type);

                // console.log(entity.data);
            });
    });

    it('fromWikiEntity Euro 2016 Event data', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q189571', claims: 'all', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = EntityBuilder.fromWikiEntity(entities[0], lang);
                assert.equal('UEFA Euro 2016', entity.name);
                // Event
                assert.equal('E', entity.type);

                // console.log(entity.data);
            });
    });

    it('fromWikiEntity Windows 7 Product data', function () {
        const lang = 'en';
        return wikiEntity.getEntities({ language: lang, ids: 'Q11215', claims: 'all', types: true })
            .then(function (entities) {
                assert.equal(1, entities.length);
                const entity = EntityBuilder.fromWikiEntity(entities[0], lang);
                assert.equal('Windows 7', entity.name);
                // Product
                assert.equal('P', entity.type);

                // console.log(entity.data);
            });
    });
});
