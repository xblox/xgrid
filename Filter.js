/** @module xgrid/Layout **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    'xide/views/_ActionMixin',
    'dojo/dom-construct'
], function (declare,types,utils,_ActionMixin,domConstruct) {

    var Implementation = {
        showFooter: true,
        buildRendering: function () {

            this.inherited(arguments);
            var grid = this;

            var filterNode = this.filterNode = domConstruct.create('div', {
                className: 'dgrid-filter'
            }, this.footerNode);

            this.filterStatusNode = domConstruct.create('div', {
                className: 'dgrid-filter-status'
            }, filterNode);

            var inputNode = this.filterInputNode = domConstruct.create('input', {
                className: 'dgrid-filter-input',
                placeholder: 'Filter (regex)...'
            }, filterNode);
            this._filterTextBoxHandle = on(inputNode, 'keydown', debounce(function () {
                grid.set("collection", grid.collection);
            }, 250));
        },
        destroy: function () {
            this.inherited(arguments);
            if (this._filterTextBoxHandle) {
                this._filterTextBoxHandle.remove();
            }
        },
        _setCollection: function (collection) {
            this.inherited(arguments);
            var value = this.filterInputNode.value;
            var renderedCollection = this._renderedCollection;
            if (renderedCollection && value) {
                var rootFilter = new renderedCollection.Filter();
                var re = new RegExp(value, "i");
                var columns = this.columns;
                var matchFilters = [];
                for (var p in columns) {
                    if (columns.hasOwnProperty(p)) {
                        matchFilters.push(rootFilter.match(columns[p].field, re));
                    }
                }
                var combined = rootFilter.or.apply(rootFilter, matchFilters);
                var filtered = renderedCollection.filter(combined);
                this._renderedCollection = filtered;
                this.refresh();
            }
        },
        refresh: function() {
            var res = this.inherited(arguments);
            var value = this.filterInputNode.value;
            if (value) {
                this.filterStatusNode.innerHTML = this.get('total') + " filtered results";
            }else {
                this.filterStatusNode.innerHTML = "";
            }
            return res;
        }


    };
    //package via declare
    var _class = declare('xgrid.Filter',null,Implementation);
    _class.Implementation = Implementation;

    return _class;
});
/*
return;
var ui = {};
require({
        packages: [{
            name: 'dstore',
            location: '//cdn.rawgit.com/SitePen/dstore/v1.0.0'
        }]
    }, ["dojo/ready", "dojo/_base/array", "dojo/dom-construct", "dojo/date/stamp", "dstore/Memory"],

    function (ready, array, domConstruct, stamp, Memory) {
        ready(function () {
            array.forEach(data1, function (r) {
                r.birthDate = stamp.fromISOString(r.birthDate);
            });
            array.forEach(data2, function (r) {
                r.birthDate = stamp.fromISOString(r.birthDate);
            });
            ui.button1.on("click", function () {
                ui.existingItemsGrid.set("collection", new Memory({
                    data: data1
                }));
            });
            ui.button2.on("click", function () {
                ui.existingItemsGrid.set("collection", new Memory({
                    data: data2
                }));
            });
        });
    });

//Setup dgrids
require({
        packages: [{
            name: 'dgrid',
            location: '//cdn.rawgit.com/SitePen/dgrid/v0.4.0'
        }, {
            name: 'xstyle',
            location: '//cdn.rawgit.com/kriszyp/xstyle/v0.2.1'
        }, {
            name: 'put-selector',
            location: '//cdn.rawgit.com/kriszyp/put-selector/v0.3.6'
        }]
    }, ["dojo/_base/declare", "dojo/on", "dojo/date/locale", "dojo/dom-construct", "dojo/debounce", "dgrid/OnDemandGrid", "dgrid/Keyboard", "dgrid/Selection", "dgrid/extensions/ColumnResizer", "dgrid/extensions/Pagination", "dgrid/extensions/DijitRegistry", "dgrid/_StoreMixin", "dojo/domReady!"],

    function (declare, on, locale, domConstruct, debounce, OnDemandGrid, Keyboard, Selection, ColumnResizer, Pagination, DijitRegistry, _StoreMixin) {
        var QuickFilter = declare(null, {
            showFooter: true,
            buildRendering: function () {
                this.inherited(arguments);
                var grid = this;
                var filterNode = this.filterNode = domConstruct.create('div', {
                    className: 'dgrid-filter'
                }, this.footerNode);
                this.filterStatusNode = domConstruct.create('div', {
                    className: 'dgrid-filter-status'
                }, filterNode);
                var inputNode = this.filterInputNode = domConstruct.create('input', {
                    className: 'dgrid-filter-input',
                    placeholder: 'Filter (regex)...'
                }, filterNode);
                this._filterTextBoxHandle = on(inputNode, 'keydown', debounce(function () {
                    grid.set("collection", grid.collection);
                }, 250));
            },
            destroy: function () {
                this.inherited(arguments);
                if (this._filterTextBoxHandle) {
                    this._filterTextBoxHandle.remove();
                }
            },
            _setCollection: function (collection) {
                this.inherited(arguments);
                var value = this.filterInputNode.value;
                var renderedCollection = this._renderedCollection;
                if (renderedCollection && value) {
                    var rootFilter = new renderedCollection.Filter();
                    var re = new RegExp(value, "i");
                    var columns = this.columns;
                    var matchFilters = [];
                    for (var p in columns) {
                        if (columns.hasOwnProperty(p)) {
                            matchFilters.push(rootFilter.match(columns[p].field, re));
                        }
                    }
                    var combined = rootFilter.or.apply(rootFilter, matchFilters);
                    var filtered = renderedCollection.filter(combined);
                    this._renderedCollection = filtered;
                    this.refresh();
                }
            },
            refresh: function() {
                this.inherited(arguments);
                var value = this.filterInputNode.value;
                if (value) {
                    this.filterStatusNode.innerHTML = this.get('total') + " filtered results";
                }else {
                    this.filterStatusNode.innerHTML = "";
                }
            }
        });
        //define grid and create
        var Grid = declare([OnDemandGrid, Keyboard, Selection, ColumnResizer, QuickFilter, Pagination, DijitRegistry]);
        ui.existingItemsGrid = new Grid({
            columns: {
                firstName: "First Name",
                lastName: "Last Name",
                birthDate: {
                    label: "Birth Date",
                    formatter: function (d) {
                        return locale.format(d, {
                            selector: "date",
                            formatLength: "short",
                            fullYear: true
                        })
                    }
                },
                address: "Address",
                city: "City",
                state: "State",
                zip: "Zip",
                email: "Email"
            },
            selectionMode: "single",
            cellNavigation: false
        }, "existingItemsGrid");
    });


//Parse widgets and setup ui variable for easy access
require(["dojo/parser", "dojo/ready", "dijit/registry", "dojo/_base/array"],

    function (parser, ready, registry, array) {
        ready(100, function () {
            parser.parse().then(function () {
                array.forEach(registry.toArray(), function (instance) {
                    ui[instance.id] = instance;
                });
            }).otherwise(function (e) {
                alert("Error parsing document: " + e.message);
            });
        });
    });

var data1 = [{
    "id": 1,
    "firstName": "Kyle",
    "lastName": "Blake",
    "birthDate": "1951-05-16T19:21:02-07:00",
    "address": "4671 At Rd.",
    "city": "Chattanooga",
    "state": "TN",
    "zip": "72737",
    "email": "nibh@Maurisvestibulumneque.com"
}, {
    "id": 2,
    "firstName": "Madison",
    "lastName": "Tillman",
    "birthDate": "1981-11-20T07:02:49-08:00",
    "address": "Ap #240-6817 Ut Street",
    "city": "Omaha",
    "state": "NE",
    "zip": "22408",
    "email": "elementum@hendreritid.org"
}, {
    "id": 3,
    "firstName": "Amethyst",
    "lastName": "Moreno",
    "birthDate": "1961-03-15T01:56:50-08:00",
    "address": "P.O. Box 470, 2077 Sit Ave",
    "city": "Rochester",
    "state": "MN",
    "zip": "40862",
    "email": "pede.nec@non.edu"
}, {
    "id": 4,
    "firstName": "Nita",
    "lastName": "King",
    "birthDate": "1953-11-12T04:43:21-08:00",
    "address": "394-6082 Dui. Rd.",
    "city": "Norman",
    "state": "OK",
    "zip": "33227",
    "email": "lectus@ut.edu"
}, {
    "id": 5,
    "firstName": "Florence",
    "lastName": "Frazier",
    "birthDate": "1956-03-17T20:36:03-08:00",
    "address": "Ap #871-6332 Integer Road",
    "city": "Bellevue",
    "state": "NE",
    "zip": "87945",
    "email": "eros@Sedeunibh.net"
}, {
    "id": 6,
    "firstName": "Lara",
    "lastName": "Hays",
    "birthDate": "1962-10-03T06:51:06-07:00",
    "address": "4672 Nisl. Avenue",
    "city": "West Valley City",
    "state": "UT",
    "zip": "66253",
    "email": "a@lacusNullatincidunt.edu"
}, {
    "id": 7,
    "firstName": "Ivana",
    "lastName": "Gardner",
    "birthDate": "1956-12-26T10:55:56-08:00",
    "address": "879 Pharetra. Rd.",
    "city": "Huntsville",
    "state": "AL",
    "zip": "35016",
    "email": "convallis.ante@antelectus.co.uk"
}, {
    "id": 8,
    "firstName": "Adria",
    "lastName": "Valenzuela",
    "birthDate": "1968-10-07T13:01:26-07:00",
    "address": "784-6249 Nam St.",
    "city": "Lafayette",
    "state": "LA",
    "zip": "86431",
    "email": "mauris.blandit.mattis@aliquet.org"
}, {
    "id": 9,
    "firstName": "Beatrice",
    "lastName": "Mccray",
    "birthDate": "1980-07-08T05:25:08-07:00",
    "address": "P.O. Box 792, 3317 Phasellus Street",
    "city": "Des Moines",
    "state": "IA",
    "zip": "28960",
    "email": "urna.Nunc@sitametluctus.edu"
}, {
    "id": 10,
    "firstName": "Noble",
    "lastName": "Erickson",
    "birthDate": "1960-02-03T20:59:17-08:00",
    "address": "Ap #268-9610 Erat Rd.",
    "city": "Knoxville",
    "state": "TN",
    "zip": "41612",
    "email": "sagittis.placerat@parturientmontes.ca"
}, {
    "id": 11,
    "firstName": "Vera",
    "lastName": "Blackwell",
    "birthDate": "1959-03-06T16:23:43-08:00",
    "address": "9053 Ut Av.",
    "city": "Frankfort",
    "state": "KY",
    "zip": "75924",
    "email": "ac@ipsumnunc.ca"
}, {
    "id": 12,
    "firstName": "Odysseus",
    "lastName": "Moore",
    "birthDate": "1976-03-24T09:40:51-08:00",
    "address": "Ap #265-3698 Consectetuer, Rd.",
    "city": "Houston",
    "state": "TX",
    "zip": "11429",
    "email": "Fusce@eleifendCrassed.org"
}, {
    "id": 13,
    "firstName": "Karina",
    "lastName": "Townsend",
    "birthDate": "1961-03-04T22:27:28-08:00",
    "address": "P.O. Box 388, 9325 Lobortis Av.",
    "city": "Dallas",
    "state": "TX",
    "zip": "68237",
    "email": "quis@Aenean.com"
}, {
    "id": 14,
    "firstName": "Sonya",
    "lastName": "Talley",
    "birthDate": "1987-01-11T14:02:05-08:00",
    "address": "6404 Egestas Road",
    "city": "Wyoming",
    "state": "WY",
    "zip": "33586",
    "email": "et@pretiumetrutrum.co.uk"
}, {
    "id": 15,
    "firstName": "Acton",
    "lastName": "Wilkins",
    "birthDate": "1980-01-15T16:44:08-08:00",
    "address": "2210 Aenean Rd.",
    "city": "Rutland",
    "state": "VT",
    "zip": "20504",
    "email": "sem.ut@ultricesVivamusrhoncus.org"
}, {
    "id": 16,
    "firstName": "Freya",
    "lastName": "Osborn",
    "birthDate": "1991-04-06T13:57:59-08:00",
    "address": "Ap #607-7527 Dignissim St.",
    "city": "Huntsville",
    "state": "AL",
    "zip": "36287",
    "email": "Cras@nascetur.co.uk"
}, {
    "id": 17,
    "firstName": "Kiayada",
    "lastName": "Morton",
    "birthDate": "1993-12-25T22:35:27-08:00",
    "address": "P.O. Box 685, 6053 Non, St.",
    "city": "Toledo",
    "state": "OH",
    "zip": "93620",
    "email": "eu.tempor.erat@Donectincidunt.net"
}, {
    "id": 18,
    "firstName": "Deacon",
    "lastName": "Rosario",
    "birthDate": "1980-04-17T11:54:01-08:00",
    "address": "P.O. Box 757, 760 Bibendum Avenue",
    "city": "Southaven",
    "state": "MS",
    "zip": "59575",
    "email": "dui.Cum@eleifendnondapibus.edu"
}, {
    "id": 19,
    "firstName": "Octavius",
    "lastName": "Vazquez",
    "birthDate": "1963-07-24T07:36:14-07:00",
    "address": "P.O. Box 848, 2709 Sed Ave",
    "city": "Cincinnati",
    "state": "OH",
    "zip": "57877",
    "email": "vitae.mauris@eratSednunc.edu"
}, {
    "id": 20,
    "firstName": "Gregory",
    "lastName": "Davis",
    "birthDate": "1987-09-07T05:06:25-07:00",
    "address": "3829 Purus. St.",
    "city": "San Diego",
    "state": "CA",
    "zip": "93408",
    "email": "neque.tellus@mauris.co.uk"
}, {
    "id": 21,
    "firstName": "Tanek",
    "lastName": "Burke",
    "birthDate": "1976-12-21T09:49:45-08:00",
    "address": "P.O. Box 142, 782 Est, Avenue",
    "city": "Boston",
    "state": "MA",
    "zip": "21182",
    "email": "dolor@consequat.co.uk"
}, {
    "id": 22,
    "firstName": "Cadman",
    "lastName": "Cleveland",
    "birthDate": "1985-05-24T18:56:14-07:00",
    "address": "9944 Lobortis, St.",
    "city": "Atlanta",
    "state": "GA",
    "zip": "67868",
    "email": "molestie@gravidaPraesenteu.co.uk"
}, {
    "id": 23,
    "firstName": "Ginger",
    "lastName": "Carlson",
    "birthDate": "1956-12-28T07:21:21-08:00",
    "address": "P.O. Box 617, 7050 Erat Road",
    "city": "Baton Rouge",
    "state": "LA",
    "zip": "24907",
    "email": "mauris.aliquam.eu@id.co.uk"
}, {
    "id": 24,
    "firstName": "Lesley",
    "lastName": "Boyle",
    "birthDate": "1976-04-18T18:09:37-08:00",
    "address": "572-5678 Vitae, St.",
    "city": "Bloomington",
    "state": "MN",
    "zip": "18338",
    "email": "egestas.rhoncus.Proin@egetodio.ca"
}, {
    "id": 25,
    "firstName": "Zena",
    "lastName": "Thompson",
    "birthDate": "1951-12-27T01:53:31-08:00",
    "address": "Ap #626-2392 Sem Rd.",
    "city": "Jackson",
    "state": "MS",
    "zip": "67720",
    "email": "sapien.Cras@Duisvolutpat.co.uk"
}, {
    "id": 26,
    "firstName": "Dorian",
    "lastName": "Pugh",
    "birthDate": "1952-05-13T01:23:06-07:00",
    "address": "P.O. Box 179, 4697 Erat Avenue",
    "city": "Kearney",
    "state": "NE",
    "zip": "23065",
    "email": "Phasellus@Suspendissecommodotincidunt.edu"
}, {
    "id": 27,
    "firstName": "Brett",
    "lastName": "Gates",
    "birthDate": "1956-10-08T21:51:01-08:00",
    "address": "P.O. Box 513, 8524 Euismod Road",
    "city": "Minneapolis",
    "state": "MN",
    "zip": "88626",
    "email": "Nam.tempor@nonummyFuscefermentum.ca"
}, {
    "id": 28,
    "firstName": "Adele",
    "lastName": "Caldwell",
    "birthDate": "1992-10-11T21:21:58-07:00",
    "address": "Ap #872-8386 Enim. Ave",
    "city": "Stamford",
    "state": "CT",
    "zip": "74164",
    "email": "quis.arcu.vel@sedconsequatauctor.co.uk"
}, {
    "id": 29,
    "firstName": "Sarah",
    "lastName": "Nixon",
    "birthDate": "1966-03-18T06:35:10-08:00",
    "address": "8823 Nullam Av.",
    "city": "Tucson",
    "state": "AZ",
    "zip": "86882",
    "email": "pharetra.Quisque@nequeseddictum.ca"
}, {
    "id": 30,
    "firstName": "Isabelle",
    "lastName": "Garrett",
    "birthDate": "1982-09-27T03:43:45-07:00",
    "address": "Ap #421-9282 Augue, Rd.",
    "city": "Lincoln",
    "state": "NE",
    "zip": "64902",
    "email": "ridiculus@Duiscursusdiam.org"
}, {
    "id": 31,
    "firstName": "Britanni",
    "lastName": "Hartman",
    "birthDate": "1962-06-13T17:10:08-07:00",
    "address": "335-8221 Tincidunt Rd.",
    "city": "Richmond",
    "state": "VA",
    "zip": "50334",
    "email": "mi.eleifend.egestas@magnaet.net"
}, {
    "id": 32,
    "firstName": "Steven",
    "lastName": "Hughes",
    "birthDate": "1956-06-05T03:13:35-07:00",
    "address": "155-6052 Nunc St.",
    "city": "Omaha",
    "state": "NE",
    "zip": "68941",
    "email": "Fusce.mollis@ligula.ca"
}, {
    "id": 33,
    "firstName": "Keiko",
    "lastName": "Hunt",
    "birthDate": "1950-10-07T06:50:34-08:00",
    "address": "561-6256 Dui Avenue",
    "city": "Aurora",
    "state": "CO",
    "zip": "22945",
    "email": "malesuada.vel@turpisnecmauris.edu"
}, {
    "id": 34,
    "firstName": "Chandler",
    "lastName": "Larson",
    "birthDate": "1964-12-28T18:29:37-08:00",
    "address": "P.O. Box 566, 5859 Ut Avenue",
    "city": "Denver",
    "state": "CO",
    "zip": "17563",
    "email": "venenatis.vel@Quisquelibero.ca"
}, {
    "id": 35,
    "firstName": "Tanek",
    "lastName": "Farrell",
    "birthDate": "1973-01-23T05:35:41-08:00",
    "address": "423-7889 Lorem St.",
    "city": "Sioux City",
    "state": "IA",
    "zip": "56924",
    "email": "odio.tristique@necenimNunc.ca"
}, {
    "id": 36,
    "firstName": "Cooper",
    "lastName": "Pierce",
    "birthDate": "1962-02-09T16:54:43-08:00",
    "address": "Ap #999-1809 Aenean Av.",
    "city": "Jackson",
    "state": "MS",
    "zip": "76593",
    "email": "hendrerit@Sedeunibh.org"
}, {
    "id": 37,
    "firstName": "Darrel",
    "lastName": "Davis",
    "birthDate": "1969-04-05T11:22:20-08:00",
    "address": "Ap #424-6217 Sagittis Street",
    "city": "Baton Rouge",
    "state": "LA",
    "zip": "94229",
    "email": "Donec.tincidunt.Donec@magna.org"
}, {
    "id": 38,
    "firstName": "Jonah",
    "lastName": "Fuentes",
    "birthDate": "1954-10-21T16:56:12-08:00",
    "address": "P.O. Box 923, 9805 Aenean Rd.",
    "city": "Miami",
    "state": "FL",
    "zip": "61879",
    "email": "Nulla@ornarelectus.co.uk"
}, {
    "id": 39,
    "firstName": "Wing",
    "lastName": "Lynn",
    "birthDate": "1979-01-03T04:05:11-08:00",
    "address": "Ap #393-6019 Sit Rd.",
    "city": "Overland Park",
    "state": "KS",
    "zip": "52340",
    "email": "metus.eu@cursuspurus.edu"
}, {
    "id": 40,
    "firstName": "Dara",
    "lastName": "Walter",
    "birthDate": "1961-10-10T01:24:39-08:00",
    "address": "383-3620 Mollis St.",
    "city": "Chicago",
    "state": "IL",
    "zip": "66742",
    "email": "molestie.sodales.Mauris@egetmollislectus.ca"
}, {
    "id": 41,
    "firstName": "Barry",
    "lastName": "Rivera",
    "birthDate": "1991-04-13T08:21:37-07:00",
    "address": "405-1598 Neque St.",
    "city": "Tuscaloosa",
    "state": "AL",
    "zip": "35349",
    "email": "aliquet.lobortis@Nuncacsem.edu"
}, {
    "id": 42,
    "firstName": "Candace",
    "lastName": "Emerson",
    "birthDate": "1995-12-01T15:03:12-08:00",
    "address": "136-9088 Semper St.",
    "city": "Las Vegas",
    "state": "NV",
    "zip": "87064",
    "email": "Aliquam@fermentum.com"
}, {
    "id": 43,
    "firstName": "Yasir",
    "lastName": "Franco",
    "birthDate": "1956-10-16T01:21:25-08:00",
    "address": "273-490 Urna Av.",
    "city": "Henderson",
    "state": "NV",
    "zip": "72661",
    "email": "Cum.sociis@Suspendissetristiqueneque.co.uk"
}, {
    "id": 44,
    "firstName": "Althea",
    "lastName": "Mcclure",
    "birthDate": "1970-08-15T23:33:54-07:00",
    "address": "1383 Velit. Street",
    "city": "Olathe",
    "state": "KS",
    "zip": "65303",
    "email": "Duis.risus.odio@rhoncus.edu"
}, {
    "id": 45,
    "firstName": "Grant",
    "lastName": "Downs",
    "birthDate": "1984-05-03T13:35:23-07:00",
    "address": "P.O. Box 729, 1312 Lobortis Av.",
    "city": "Des Moines",
    "state": "IA",
    "zip": "26442",
    "email": "parturient@tellusSuspendisse.net"
}, {
    "id": 46,
    "firstName": "Carl",
    "lastName": "Gould",
    "birthDate": "1978-04-06T01:32:11-08:00",
    "address": "962-5355 Dapibus St.",
    "city": "Gulfport",
    "state": "MS",
    "zip": "31661",
    "email": "lobortis@Maurisvelturpis.org"
}, {
    "id": 47,
    "firstName": "Jamalia",
    "lastName": "Shaffer",
    "birthDate": "1955-09-17T17:26:17-07:00",
    "address": "948-7773 Faucibus Road",
    "city": "New Orleans",
    "state": "LA",
    "zip": "55098",
    "email": "nisi@vel.edu"
}, {
    "id": 48,
    "firstName": "Yoko",
    "lastName": "Vang",
    "birthDate": "1957-05-01T16:18:23-07:00",
    "address": "Ap #105-666 Eros Rd.",
    "city": "Honolulu",
    "state": "HI",
    "zip": "23289",
    "email": "et.ipsum@lectusNullamsuscipit.edu"
}, {
    "id": 49,
    "firstName": "Grady",
    "lastName": "Calderon",
    "birthDate": "1997-03-30T00:49:26-08:00",
    "address": "P.O. Box 689, 9264 Nisi St.",
    "city": "Helena",
    "state": "MT",
    "zip": "27547",
    "email": "eu@maurisInteger.co.uk"
}, {
    "id": 50,
    "firstName": "Hamish",
    "lastName": "Moore",
    "birthDate": "1998-06-22T21:01:07-07:00",
    "address": "335-2636 Dis Ave",
    "city": "Gaithersburg",
    "state": "MD",
    "zip": "64693",
    "email": "mi.Duis@risusDonecegestas.ca"
}];
var data2 = [{
    "id": 51,
    "firstName": "Zenia",
    "lastName": "Richards",
    "birthDate": "1975-11-07T21:17:46-08:00",
    "address": "419-9155 Mi Road",
    "city": "Columbia",
    "state": "MD",
    "zip": "68042",
    "email": "at.pede.Cras@facilisiSedneque.org"
}, {
    "id": 52,
    "firstName": "Erin",
    "lastName": "Goodman",
    "birthDate": "1956-10-30T04:19:54-08:00",
    "address": "305-9431 Luctus Ave",
    "city": "Kapolei",
    "state": "HI",
    "zip": "15692",
    "email": "id@lacus.co.uk"
}, {
    "id": 53,
    "firstName": "Vance",
    "lastName": "Raymond",
    "birthDate": "1986-11-19T22:20:44-08:00",
    "address": "836-4565 Feugiat Street",
    "city": "Salem",
    "state": "OR",
    "zip": "96451",
    "email": "mattis.ornare.lectus@doloregestasrhoncus.org"
}, {
    "id": 54,
    "firstName": "Kitra",
    "lastName": "Carpenter",
    "birthDate": "1986-04-14T21:51:07-08:00",
    "address": "636-6610 In Avenue",
    "city": "Bozeman",
    "state": "MT",
    "zip": "91909",
    "email": "magna.malesuada.vel@urna.ca"
}, {
    "id": 55,
    "firstName": "Judith",
    "lastName": "Carver",
    "birthDate": "1985-04-30T17:03:32-07:00",
    "address": "1822 Malesuada Avenue",
    "city": "Honolulu",
    "state": "HI",
    "zip": "43634",
    "email": "eget.laoreet.posuere@inmolestie.org"
}, {
    "id": 56,
    "firstName": "Nathan",
    "lastName": "Cox",
    "birthDate": "1972-08-03T23:46:25-07:00",
    "address": "Ap #455-3253 Convallis Av.",
    "city": "Cheyenne",
    "state": "WY",
    "zip": "74286",
    "email": "ac.eleifend.vitae@mattisornare.edu"
}, {
    "id": 57,
    "firstName": "Ruth",
    "lastName": "Craft",
    "birthDate": "1959-10-24T02:17:32-08:00",
    "address": "Ap #443-6182 Penatibus Ave",
    "city": "Overland Park",
    "state": "KS",
    "zip": "66267",
    "email": "magna@vitaepurusgravida.edu"
}, {
    "id": 58,
    "firstName": "Kevyn",
    "lastName": "Stephens",
    "birthDate": "1954-06-08T16:34:58-07:00",
    "address": "P.O. Box 161, 9219 Sit Rd.",
    "city": "Warren",
    "state": "MI",
    "zip": "38468",
    "email": "egestas.Aliquam@eunibh.co.uk"
}, {
    "id": 59,
    "firstName": "Hollee",
    "lastName": "Bender",
    "birthDate": "1964-02-25T04:13:05-08:00",
    "address": "164-996 Augue Street",
    "city": "Madison",
    "state": "WI",
    "zip": "28933",
    "email": "quis@libero.org"
}, {
    "id": 60,
    "firstName": "Cyrus",
    "lastName": "Pruitt",
    "birthDate": "1984-07-20T09:33:21-07:00",
    "address": "629-8655 Ultricies St.",
    "city": "Pocatello",
    "state": "ID",
    "zip": "88967",
    "email": "Quisque@Vivamus.edu"
}, {
    "id": 61,
    "firstName": "Brennan",
    "lastName": "Guerra",
    "birthDate": "1984-01-04T18:00:13-08:00",
    "address": "767-5319 Tortor. Ave",
    "city": "Sandy",
    "state": "UT",
    "zip": "80651",
    "email": "pellentesque.a@Suspendisse.edu"
}, {
    "id": 62,
    "firstName": "Donovan",
    "lastName": "Rodriguez",
    "birthDate": "1968-02-20T08:04:06-08:00",
    "address": "986-5167 Quisque Rd.",
    "city": "South Bend",
    "state": "IN",
    "zip": "95610",
    "email": "leo.elementum.sem@semmollisdui.edu"
}, {
    "id": 63,
    "firstName": "Iliana",
    "lastName": "Henson",
    "birthDate": "1966-09-26T14:59:32-07:00",
    "address": "Ap #107-9648 Sem St.",
    "city": "Portland",
    "state": "OR",
    "zip": "88065",
    "email": "pretium.neque@duiFuscealiquam.com"
}, {
    "id": 64,
    "firstName": "Stone",
    "lastName": "Rivera",
    "birthDate": "1993-12-07T13:41:56-08:00",
    "address": "134-3861 Posuere Rd.",
    "city": "Meridian",
    "state": "ID",
    "zip": "38231",
    "email": "Fusce.diam@amet.net"
}, {
    "id": 65,
    "firstName": "Alexander",
    "lastName": "Stephens",
    "birthDate": "1962-06-13T12:20:43-07:00",
    "address": "5994 Mauris Rd.",
    "city": "Sterling Heights",
    "state": "MI",
    "zip": "27932",
    "email": "Cras.vulputate@maurissapien.ca"
}, {
    "id": 66,
    "firstName": "Bree",
    "lastName": "Conley",
    "birthDate": "1970-08-23T07:24:40-07:00",
    "address": "Ap #604-972 Lobortis St.",
    "city": "Austin",
    "state": "TX",
    "zip": "72315",
    "email": "feugiat.tellus@molestietellus.com"
}, {
    "id": 67,
    "firstName": "Dylan",
    "lastName": "Arnold",
    "birthDate": "1963-02-05T15:01:24-08:00",
    "address": "P.O. Box 426, 2417 Etiam Ave",
    "city": "Mobile",
    "state": "AL",
    "zip": "35894",
    "email": "nibh.Quisque.nonummy@Aliquam.net"
}, {
    "id": 68,
    "firstName": "Sybill",
    "lastName": "Jenkins",
    "birthDate": "1986-12-03T17:50:38-08:00",
    "address": "Ap #462-3296 Mi Avenue",
    "city": "Kapolei",
    "state": "HI",
    "zip": "24095",
    "email": "auctor@turpis.co.uk"
}, {
    "id": 69,
    "firstName": "Laith",
    "lastName": "Bryan",
    "birthDate": "1982-07-23T06:09:57-07:00",
    "address": "P.O. Box 135, 1790 Consectetuer Road",
    "city": "College",
    "state": "AK",
    "zip": "99596",
    "email": "dolor@velitCraslorem.net"
}, {
    "id": 70,
    "firstName": "Tate",
    "lastName": "Hernandez",
    "birthDate": "1956-09-17T06:21:13-07:00",
    "address": "P.O. Box 550, 2905 Tempor St.",
    "city": "Bangor",
    "state": "ME",
    "zip": "75899",
    "email": "Phasellus@urna.co.uk"
}, {
    "id": 71,
    "firstName": "Mariko",
    "lastName": "Doyle",
    "birthDate": "1981-04-30T13:34:17-07:00",
    "address": "986-760 Luctus. Rd.",
    "city": "Boise",
    "state": "ID",
    "zip": "24940",
    "email": "aliquet.Proin.velit@sempertellus.com"
}, {
    "id": 72,
    "firstName": "Walker",
    "lastName": "Nielsen",
    "birthDate": "1987-09-23T00:33:36-07:00",
    "address": "P.O. Box 273, 2320 Purus Ave",
    "city": "Hilo",
    "state": "HI",
    "zip": "93333",
    "email": "libero.dui@Curabiturut.co.uk"
}, {
    "id": 73,
    "firstName": "Leo",
    "lastName": "Dean",
    "birthDate": "1950-12-31T02:16:03-08:00",
    "address": "Ap #374-4688 Fermentum Road",
    "city": "Dallas",
    "state": "TX",
    "zip": "27658",
    "email": "nunc.sit@Integervitaenibh.net"
}, {
    "id": 74,
    "firstName": "Ariana",
    "lastName": "Barrera",
    "birthDate": "1997-11-30T18:41:47-08:00",
    "address": "Ap #538-7358 Turpis Ave",
    "city": "Nashville",
    "state": "TN",
    "zip": "36234",
    "email": "metus.Vivamus@rhoncus.edu"
}, {
    "id": 75,
    "firstName": "Akeem",
    "lastName": "Mcfadden",
    "birthDate": "1950-07-12T01:37:18-07:00",
    "address": "Ap #191-8118 Auctor. Rd.",
    "city": "Idaho Falls",
    "state": "ID",
    "zip": "75263",
    "email": "pretium@aliquamadipiscinglacus.ca"
}, {
    "id": 76,
    "firstName": "Jin",
    "lastName": "Johnson",
    "birthDate": "1962-05-23T12:48:43-07:00",
    "address": "169-6077 Metus. Rd.",
    "city": "Idaho Falls",
    "state": "ID",
    "zip": "66067",
    "email": "eget.varius.ultrices@dolornonummy.co.uk"
}, {
    "id": 77,
    "firstName": "Tatum",
    "lastName": "Madden",
    "birthDate": "1952-06-15T13:16:01-07:00",
    "address": "Ap #647-993 Penatibus Road",
    "city": "Jackson",
    "state": "MS",
    "zip": "98451",
    "email": "sit.amet.ultricies@pellentesque.org"
}, {
    "id": 78,
    "firstName": "Inga",
    "lastName": "Hurst",
    "birthDate": "1997-06-10T04:27:33-07:00",
    "address": "P.O. Box 145, 4188 Ante, Ave",
    "city": "Bear",
    "state": "DE",
    "zip": "81384",
    "email": "Quisque@pharetraNamac.edu"
}, {
    "id": 79,
    "firstName": "Jemima",
    "lastName": "Espinoza",
    "birthDate": "1950-06-17T05:18:18-07:00",
    "address": "4225 Aliquet St.",
    "city": "Kapolei",
    "state": "HI",
    "zip": "63693",
    "email": "interdum@Nullamut.org"
}, {
    "id": 80,
    "firstName": "Flavia",
    "lastName": "Berg",
    "birthDate": "1950-12-30T09:22:16-08:00",
    "address": "916-4556 Sem Avenue",
    "city": "Tacoma",
    "state": "WA",
    "zip": "88108",
    "email": "vulputate.velit.eu@tincidunt.org"
}, {
    "id": 81,
    "firstName": "Leo",
    "lastName": "Mcgowan",
    "birthDate": "1995-10-09T03:51:13-07:00",
    "address": "Ap #574-1901 Mollis. Rd.",
    "city": "Hillsboro",
    "state": "OR",
    "zip": "33367",
    "email": "tempus.lorem.fringilla@vehiculaPellentesquetincidunt.ca"
}, {
    "id": 82,
    "firstName": "Amal",
    "lastName": "Wilcox",
    "birthDate": "1983-08-30T18:20:21-07:00",
    "address": "6550 Donec Street",
    "city": "Kansas City",
    "state": "KS",
    "zip": "86743",
    "email": "vel.mauris@neque.net"
}, {
    "id": 83,
    "firstName": "Calvin",
    "lastName": "Adkins",
    "birthDate": "1962-01-07T21:54:16-08:00",
    "address": "P.O. Box 202, 1663 Velit. Ave",
    "city": "Davenport",
    "state": "IA",
    "zip": "79492",
    "email": "sem.mollis.dui@penatibus.co.uk"
}, {
    "id": 84,
    "firstName": "Jonah",
    "lastName": "Mcclain",
    "birthDate": "1966-10-18T12:37:55-07:00",
    "address": "3283 Ante Road",
    "city": "Memphis",
    "state": "TN",
    "zip": "85579",
    "email": "ornare.facilisis.eget@a.ca"
}, {
    "id": 85,
    "firstName": "Nomlanga",
    "lastName": "Armstrong",
    "birthDate": "1959-03-24T13:53:32-08:00",
    "address": "6594 Dolor. Av.",
    "city": "Springfield",
    "state": "MA",
    "zip": "84541",
    "email": "sodales.elit@Curabiturmassa.org"
}, {
    "id": 86,
    "firstName": "Hamish",
    "lastName": "Carey",
    "birthDate": "1991-02-10T17:54:06-08:00",
    "address": "9175 Dis St.",
    "city": "Green Bay",
    "state": "WI",
    "zip": "60443",
    "email": "risus.Quisque.libero@tristiquepharetra.co.uk"
}, {
    "id": 87,
    "firstName": "Stacy",
    "lastName": "Wilkerson",
    "birthDate": "1961-04-04T02:26:36-08:00",
    "address": "Ap #857-5354 Velit St.",
    "city": "Kearney",
    "state": "NE",
    "zip": "37536",
    "email": "orci.luctus.et@utpellentesque.ca"
}, {
    "id": 88,
    "firstName": "Ferris",
    "lastName": "Gillespie",
    "birthDate": "1967-08-21T19:31:22-07:00",
    "address": "5266 Mauris Rd.",
    "city": "Fort Smith",
    "state": "AR",
    "zip": "72475",
    "email": "massa.Mauris@Naminterdumenim.ca"
}, {
    "id": 89,
    "firstName": "Shelby",
    "lastName": "English",
    "birthDate": "1958-07-21T04:09:03-07:00",
    "address": "Ap #319-7691 Tristique Av.",
    "city": "Fayetteville",
    "state": "AR",
    "zip": "71975",
    "email": "ligula@Duisac.net"
}, {
    "id": 90,
    "firstName": "Keefe",
    "lastName": "Haney",
    "birthDate": "1989-03-26T20:35:06-08:00",
    "address": "4477 Mollis. Av.",
    "city": "Columbia",
    "state": "MO",
    "zip": "80555",
    "email": "sapien.Aenean.massa@apurusDuis.ca"
}, {
    "id": 91,
    "firstName": "Alika",
    "lastName": "Aguilar",
    "birthDate": "1991-10-13T03:09:57-07:00",
    "address": "5301 Vitae St.",
    "city": "Sioux City",
    "state": "IA",
    "zip": "78059",
    "email": "augue@vestibulum.com"
}, {
    "id": 92,
    "firstName": "Chase",
    "lastName": "Craig",
    "birthDate": "1975-09-27T23:39:54-07:00",
    "address": "P.O. Box 740, 920 Eget St.",
    "city": "Grand Island",
    "state": "NE",
    "zip": "21421",
    "email": "sem@Crasconvallis.com"
}, {
    "id": 93,
    "firstName": "Luke",
    "lastName": "Bush",
    "birthDate": "1975-10-05T11:21:37-07:00",
    "address": "966-3832 Aliquam Ave",
    "city": "South Bend",
    "state": "IN",
    "zip": "37919",
    "email": "Nulla@sollicitudin.edu"
}, {
    "id": 94,
    "firstName": "Maya",
    "lastName": "Burgess",
    "birthDate": "1974-01-07T18:02:40-07:00",
    "address": "4305 Ut, Rd.",
    "city": "Springfield",
    "state": "IL",
    "zip": "19156",
    "email": "ac@egetmagna.net"
}, {
    "id": 95,
    "firstName": "Risa",
    "lastName": "Finley",
    "birthDate": "1973-02-08T15:36:13-08:00",
    "address": "Ap #233-2904 Luctus Avenue",
    "city": "Grand Rapids",
    "state": "MI",
    "zip": "70761",
    "email": "erat.vel.pede@consectetueradipiscingelit.ca"
}, {
    "id": 96,
    "firstName": "Aiko",
    "lastName": "Finch",
    "birthDate": "1976-06-12T01:13:33-07:00",
    "address": "Ap #441-5545 Pellentesque Avenue",
    "city": "Cheyenne",
    "state": "WY",
    "zip": "30304",
    "email": "morbi.tristique@consectetuermaurisid.com"
}, {
    "id": 97,
    "firstName": "Jamalia",
    "lastName": "Coleman",
    "birthDate": "1992-06-14T01:10:04-07:00",
    "address": "P.O. Box 649, 6365 A Avenue",
    "city": "Fayetteville",
    "state": "AR",
    "zip": "71761",
    "email": "Vivamus.molestie@malesuadafamesac.co.uk"
}, {
    "id": 98,
    "firstName": "Alma",
    "lastName": "Blankenship",
    "birthDate": "1957-04-11T18:05:43-08:00",
    "address": "P.O. Box 487, 7692 Sodales Road",
    "city": "Fresno",
    "state": "CA",
    "zip": "95960",
    "email": "et@ante.net"
}, {
    "id": 99,
    "firstName": "Zane",
    "lastName": "Acosta",
    "birthDate": "1992-05-05T09:24:18-07:00",
    "address": "Ap #174-5160 Et Av.",
    "city": "Baton Rouge",
    "state": "LA",
    "zip": "78004",
    "email": "mauris.ipsum@metus.net"
}, {
    "id": 100,
    "firstName": "Shannon",
    "lastName": "Mathis",
    "birthDate": "1959-02-12T04:35:47-08:00",
    "address": "P.O. Box 200, 2009 Ornare Rd.",
    "city": "Lewiston",
    "state": "ME",
    "zip": "32238",
    "email": "nibh.Aliquam@hendreritneque.ca"
}];
    */