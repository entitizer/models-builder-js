
import { WikiEntity } from 'wiki-entity';
import { Entity } from 'entitizer.models';
import { wikiEntityToEntity } from './wikiEntityToEntity';

const EntityBuilder = { fromWikiEntity: wikiEntityToEntity }

export { EntityBuilder as Entity }
