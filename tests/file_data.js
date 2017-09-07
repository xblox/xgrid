define([
    "xdojo/declare"
], function (declare) {
    var module = declare('data', null, {});
    module.createFileListingData = function ()
    {
        return [
            {
                "name": "xapp",
                "permissions": "0775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {
                        "name": "mc007", "passwd": "x", "members": [], "gid": 1000
                    }
                },
                "readOnly": false,
                "isDir": true,
                "size": "183.50 MB",
                "sizeBytes": 192418627,
                "mime": "directory",
                "modified": 1443870200,
                "path": ".\/xapp",
                "mount": "\/root",
                "remote": false,
                "children": [],
                "_EX": false,
                "directory": true
            }, {
                "name": "package.json",
                "permissions": "00777",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    },
                    "group": {
                        "name": "mc007",
                        "passwd": "x",
                        "members": [],
                        "gid": 1000
                    }
                },
                "readOnly": false,
                "isDir": false,
                "size": "634 bytes",
                "sizeBytes": 634,
                "mime": "text\/plain",
                "modified": 1442753332,
                "path": ".\/package.json",
                "mount": "\/root",
                "remote": false
            }, {
                "name": "utils",
                "permissions": "0775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": true,
                "size": "28.03 MB",
                "sizeBytes": 29386897,
                "mime": "directory",
                "modified": 1444072808,
                "path": ".\/utils",
                "mount": "\/root",
                "remote": false,
                "children": [],
                "_EX": false,
                "directory": true
            }, {
                "name": "node_modules",
                "permissions": "0755",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": true,
                "size": "109.51 MB",
                "sizeBytes": 114824502,
                "mime": "directory",
                "modified": 1443959349,
                "path": ".\/node_modules",
                "mount": "\/root",
                "remote": false,
                "children": [],
                "_EX": false,
                "directory": true
            }, {
                "name": "DIST",
                "permissions": "0775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": true,
                "size": "13.70 KB",
                "sizeBytes": 14024,
                "mime": "directory",
                "modified": 1443867243,
                "path": ".\/DIST",
                "mount": "\/root",
                "remote": false,
                "children": [],
                "_EX": false,
                "directory": true
            }, {
                "name": "WELCOME.md",
                "permissions": "00664",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": false,
                "size": "9.25 KB",
                "sizeBytes": 9473,
                "mime": "text\/plain",
                "modified": 1443867243,
                "path": ".\/WELCOME.md",
                "mount": "\/root",
                "remote": false
            }, {
                "name": "user",
                "permissions": "0775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": true,
                "size": "47.74 MB",
                "sizeBytes": 50061233,
                "mime": "directory",
                "modified": 1444127768,
                "path": ".\/user",
                "mount": "\/root",
                "remote": false,
                "children": [],
                "_EX": false,
                "directory": true
            }, {
                "name": "README.md",
                "permissions": "00775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": false,
                "size": "211 bytes",
                "sizeBytes": 211,
                "mime": "text\/plain",
                "modified": 1443867243,
                "path": ".\/README.md",
                "mount": "\/root",
                "remote": false
            }, {
                "name": "demo",
                "permissions": "0775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": true,
                "size": "4.05 MB",
                "sizeBytes": 4251059,
                "mime": "directory",
                "modified": 1443867243,
                "path": ".\/demo",
                "mount": "\/root",
                "remote": false,
                "children": [],
                "_EX": false,
                "directory": true
            }, {
                "name": "scripts",
                "permissions": "0775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": true,
                "size": "5.02 KB",
                "sizeBytes": 5138,
                "mime": "directory",
                "modified": 1443867243,
                "path": ".\/scripts",
                "mount": "\/root",
                "remote": false,
                "children": [],
                "_EX": false,
                "directory": true
            }, {
                "name": "conf",
                "permissions": "0775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": true,
                "size": "36.09 KB",
                "sizeBytes": 36954,
                "mime": "directory",
                "modified": 1443875091,
                "path": ".\/conf",
                "mount": "\/root",
                "remote": false,
                "children": [],
                "_EX": false,
                "directory": true
            }, {
                "name": "client",
                "permissions": "0775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": true,
                "size": "313.14 MB",
                "sizeBytes": 328354902,
                "mime": "directory",
                "modified": 1443969201,
                "path": ".\/client",
                "mount": "\/root",
                "remote": false,
                "children": [],
                "_EX": false,
                "directory": true
            }, {
                "name": "todo.md",
                "permissions": "00664",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": false,
                "size": "347 bytes",
                "sizeBytes": 347,
                "mime": "text\/plain",
                "modified": 1443973800,
                "path": ".\/todo.md",
                "mount": "\/root",
                "remote": false
            }, {
                "name": "install",
                "permissions": "0775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": true,
                "size": "63.94 KB",
                "sizeBytes": 65472,
                "mime": "directory",
                "modified": 1443867243,
                "path": ".\/install",
                "mount": "\/root",
                "remote": false,
                "children": [],
                "_EX": false,
                "directory": true
            }, {
                "name": "docs",
                "permissions": "0775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": true,
                "size": "10.14 KB",
                "sizeBytes": 10387,
                "mime": "directory",
                "modified": 1444037680,
                "path": ".\/docs",
                "mount": "\/root",
                "remote": false,
                "children": [],
                "_EX": false,
                "directory": true
            }, {
                "name": "misc",
                "permissions": "0775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": true,
                "size": "5.05 MB",
                "sizeBytes": 5297830,
                "mime": "directory",
                "modified": 1443867243,
                "path": ".\/misc",
                "mount": "\/root",
                "remote": false,
                "children": [],
                "_EX": false,
                "directory": true
            }, {
                "name": "logs",
                "permissions": "0775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": true,
                "size": "4.00 KB",
                "sizeBytes": 4096,
                "mime": "directory",
                "modified": 1443867243,
                "path": ".\/logs",
                "mount": "\/root",
                "remote": false,
                "children": [],
                "_EX": false,
                "directory": true
            }, {
                "name": "Gruntfile.js",
                "permissions": "00777",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": false,
                "size": "6.69 KB",
                "sizeBytes": 6849,
                "mime": "text\/plain",
                "modified": 1442745844,
                "path": ".\/Gruntfile.js",
                "mount": "\/root",
                "remote": false
            }, {
                "name": "test",
                "permissions": "0775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": true,
                "size": "59.02 KB",
                "sizeBytes": 60437,
                "mime": "directory",
                "modified": 1443867243,
                "path": ".\/test",
                "mount": "\/root",
                "remote": false,
                "children": [],
                "_EX": false,
                "directory": true
            }, {
                "name": "index.php",
                "permissions": "00775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": false,
                "size": "13.88 KB",
                "sizeBytes": 14208,
                "mime": "text\/x-php",
                "modified": 1443984756,
                "path": ".\/index.php",
                "mount": "\/root",
                "remote": false
            }, {
                "name": "build",
                "permissions": "0775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": true,
                "size": "30.08 KB",
                "sizeBytes": 30803,
                "mime": "directory",
                "modified": 1443867243,
                "path": ".\/build",
                "mount": "\/root",
                "remote": false,
                "children": [],
                "_EX": false,
                "directory": true
            }, {
                "name": ".gitignore",
                "permissions": "00775",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": false,
                "size": "940 bytes",
                "sizeBytes": 940,
                "mime": "text\/plain",
                "modified": 1443867243,
                "path": ".\/.gitignore",
                "mount": "\/root",
                "remote": false
            }, {
                "name": ".gitmodules",
                "permissions": "00664",
                "read": true,
                "write": true,
                "owner": {
                    "user": {
                        "name": "mc007",
                        "passwd": "x",
                        "uid": 1000,
                        "gid": 1000,
                        "gecos": "mc007,,,",
                        "dir": "\/home\/mc007",
                        "shell": "\/bin\/bash"
                    }, "group": {"name": "mc007", "passwd": "x", "members": [], "gid": 1000}
                },
                "readOnly": false,
                "isDir": false,
                "size": "325 bytes",
                "sizeBytes": 325,
                "mime": "text\/plain",
                "modified": 1443867385,
                "path": ".\/.gitmodules",
                "mount": "\/root",
                "remote": false
            }
        ];
    };
    return module;

});