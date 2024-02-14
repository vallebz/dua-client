"use strict";
/**
 * Concat the RDF namespace identified by the prefix used as function name
 * with the RDF thing identifier as function parameter,
 * e.g. FOAF("knows") resovles to "http://xmlns.com/foaf/0.1/knows"
 * @param namespace uri of the namesapce
 * @returns function which takes a parameter of RDF thing identifier as string
 */
function Namespace(namespace: string) {
  return (thing: string) => namespace.concat(thing);
}

// Namespaces as functions where their parameter is the RDF thing identifier => concat, e.g. FOAF("knows") resovles to "http://xmlns.com/foaf/0.1/knows"
export const FOAF = Namespace("http://xmlns.com/foaf/0.1/");
export const DC = Namespace("http://purl.org/dc/terms/");
export const RDF = Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
export const RDFS = Namespace("http://www.w3.org/2000/01/rdf-schema#");
export const WDT = Namespace("http://www.wikidata.org/prop/direct/");
export const WD = Namespace("http://www.wikidata.org/entity/");
export const LDP = Namespace("http://www.w3.org/ns/ldp#");
export const AS = Namespace("https://www.w3.org/ns/activitystreams#");
export const XSD = Namespace("http://www.w3.org/2001/XMLSchema#");
export const ETHON = Namespace("http://ethon.consensys.net/");
export const PDGR = Namespace("http://purl.org/pedigree#");
export const LDCV = Namespace("http://people.aifb.kit.edu/co1683/2019/ld-chain/vocab#");
export const WILD = Namespace("http://purl.org/wild/vocab#");
export const ACL = Namespace("http://www.w3.org/ns/auth/acl#");
export const ACP = Namespace("http://www.w3.org/ns/solid/acp#");
export const CRED = Namespace("https://w3.org/2018/credentials#");
export const DPV = Namespace("http://www.w3.org/ns/dpv#");
export const EX = Namespace("http://example.org/");
export const OAC = Namespace("https://w3id.org/oac#");
export const ODRL = Namespace("http://www.w3.org/ns/odrl/2/");
export const SCHEMA = Namespace("http://schema.org/");
export const SEC = Namespace("https://w3id.org/security#");
export const SH = Namespace("http://www.w3.org/ns/shacl#");
export const VCARD = Namespace("http://www.w3.org/2006/vcard/ns#");