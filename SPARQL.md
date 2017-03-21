# Wikidata SPARQL queries

## All subclasses of Human

```sparql
SELECT DISTINCT ?item ?itemLabel
WHERE
{
	?item wdt:P279 wd:Q5 .     # Subclass of Human
  
	SERVICE wikibase:label {
		bd:serviceParam wikibase:language "en" 
	}
}
ORDER BY ?item
limit 1000
```

## All subclasses of Event

```sparql
SELECT DISTINCT ?item ?itemLabel
WHERE
{
	?item wdt:P279 wd:Q1656682 .     # Subclass of Event
  
	SERVICE wikibase:label {
		bd:serviceParam wikibase:language "en" 
	}
}
ORDER BY ?item
limit 1000
```