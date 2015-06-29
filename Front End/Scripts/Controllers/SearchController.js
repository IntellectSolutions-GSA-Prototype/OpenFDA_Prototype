app.controller('SearchController', ['$routeParams', '$http', '$log', function ($routeParams, $http, $log) {
    var $this = this;
    this.title = "openFDA Search";
    this.context = null;
    this.setPageTitle = function () {
        window.setPageTitle('openFDA Search');
    };
    this.drugType = 0;
    this.drugTypeToNumber = function () {
        return exoTools.convert.toNumber(this.drugType);
    };
    this.drugSource = 0;
    this.drugSourceToNumber = function () {
        return exoTools.convert.toNumber(this.drugSource);
    };
    var defaultListItem = {
        id: -1,
        value: 'Select a Drug Name'
    }
    this.drugName = defaultListItem;
    this.listItems = [defaultListItem];
    this.compileList = function () {
        this.listItems = [defaultListItem];
        this.drugName = defaultListItem;
        var errorHanlder = function (data, status, headers, config) {
            $log.log('There was an error retrieving drug names...')
        };
        var successHandler = function (data, status, headers, config) {
            if (exoTools.isDefined(data.results)) {
                var results = data.results;
                var enumerable = exoTools.collections.asEnumerable(results).orderBy(function (a, b) {
                    if (a.term < b.term) {
                        return -1;
                    }
                    if (a.term > b.term) {
                        return 1;
                    }
                    return 0;
                });
                var output = new exoTools.collections.list();
                output.add(defaultListItem);
                enumerable.forEach(function (index, value) {
                    var listItem = {
                        id: index,
                        value: value.term
                    };
                    output = output.add(listItem);
                });
                $this.listItems = output.toArray();
            }
        };
        if (this.drugTypeToNumber() === this.drugTypes.brand.toNumber() && this.drugSourceToNumber() === this.drugSources.OTC.toNumber()) {
            $http.get('https://openfda.intellectsolutions.com:8000/openfda/listBrandNameOTCDrugs')
            .success(function (data, status, headers, config) {
                successHandler(data, status, headers, config);
            })
            .error(function (data, status, headers, config) {
                errorHanlder(data, status, headers, config);
            });
        } else if (this.drugTypeToNumber() === this.drugTypes.brand.toNumber() && this.drugSourceToNumber() === this.drugSources.prescription.toNumber()) {
            $http.get('https://openfda.intellectsolutions.com:8000/openfda/listBrandNamePresDrugs')
            .success(function (data, status, headers, config) {
                successHandler(data, status, headers, config);
            })
            .error(function (data, status, headers, config) {
                errorHanlder(data, status, headers, config);
            });
        } else if (this.drugTypeToNumber() === this.drugTypes.generic.toNumber() && this.drugSourceToNumber() === this.drugSources.OTC.toNumber()) {
            $http.get('https://openfda.intellectsolutions.com:8000/openfda/listGenericOTCDrugs')
            .success(function (data, status, headers, config) {
                successHandler(data, status, headers, config);
            })
            .error(function (data, status, headers, config) {
                errorHanlder(data, status, headers, config);
            });
        } else if (this.drugTypeToNumber() === this.drugTypes.generic.toNumber() && this.drugSourceToNumber() === this.drugSources.prescription.toNumber()) {
            $http.get('https://openfda.intellectsolutions.com:8000/openfda/listGenericPresDrugs')
            .success(function (data, status, headers, config) {
                successHandler(data, status, headers, config);
            })
            .error(function (data, status, headers, config) {
                errorHanlder(data, status, headers, config);
            });
        }
    };
    this.drugTypes = new Enum({
        brand: new EnumMember(0, 'Brand Name'),
        generic: new EnumMember(1, 'Generic')
    });
    this.drugSources = new Enum({
        OTC: new EnumMember(0, 'OTC'),
        prescription: new EnumMember(1, 'Prescription'),
    });
    this.dataSet = {
        terms: [],
        _type: 'terms',
        other: 0,
        total: 0,
        missing: 0
    };
    this.displayData = function (queryType) {
        switch (queryType) {
            case 1:
                var query = new Query({
                    drugType: (this.drugTypeToNumber() === this.drugTypes.brand.toNumber() ? this.drugTypes.brand : this.drugTypes.generic).toNumber(),
                    drugSource: (this.drugSourceToNumber() === this.drugSources.OTC.toNumber() ? this.drugSources.OTC : this.drugSources.prescription).toNumber(),
                    filterIndex: $this.selectedReaction,
                    queryType: 1
                });
                $http.post('https://openfda.intellectsolutions.com:8000/openfda/query', query).success(function (data, status, headers, config) {
                    if (exoTools.isDefined(data) && exoTools.isArray(data.results)) {
                        var results = data.results;
                        var enumerable = exoTools.collections.asEnumerable(results);
                        var orderByIncidence = enumerable.orderBy(function (drugA, drugB) {
                            if (drugA.count > drugB.count) {
                                return 1;
                            }
                            if (drugA.count < drugB.count) {
                                return -1;
                            }
                            return 0;
                        }).reverse();
                        $this.dataSet = {
                            _type: 'terms',
                            other: 0,
                            missing: 0,
                            terms: orderByIncidence.toArray(),
                            total: orderByIncidence.count()
                        };
                    }
                }).error(function (data, status, headers, config) {
                    $log.log(data);
                });
                break;
            case 2:
                if (exoTools.isDefined(this.drugName) && this.drugName.id !== defaultListItem.id) {
                    var query = new Query({
                        queryType: 2,
                        drugName: this.drugName.value,
                        filterIndex: this.selectedDemograph,
                        drugType: (this.drugTypeToNumber() === this.drugTypes.brand.toNumber() ? this.drugTypes.brand : this.drugTypes.generic).toNumber(),
                        drugSource: (this.drugSourceToNumber() === this.drugSources.OTC.toNumber() ? this.drugSources.OTC : this.drugSources.prescription).toNumber(),
                    });
                    $log.log(query);
                    $http.post('https://openfda.intellectsolutions.com:8000/openfda/query', query).success(function (data, status, headers, config) {
                        if (exoTools.isDefined(data) && exoTools.isArray(data.results)) {
                            var results = data.results;
                            var enumerable = exoTools.collections.asEnumerable(results);
                            var orderByIncidence = enumerable.orderBy(function (drugA, drugB) {
                                return drugA.count > drugB.count ? 1 : drugA.count < drugB.count ? -1 : 0;
                            }).reverse();
                            $this.dataSet = {
                                _type: 'terms',
                                other: 0,
                                missing: 0,
                                terms: orderByIncidence.toArray(),
                                total: orderByIncidence.count()
                            };
                        }
                    }).error(function (data, status, headers, config) {
                        $log.log(data);
                    });
                }
                break;
            case 3:
                if (exoTools.isDefined(this.drugName) && this.drugName.id !== defaultListItem.id) {
                    var query = new Query({
                        queryType: 3,
                        drugName: this.drugName.value,
                        drugType: (this.drugTypeToNumber() === this.drugTypes.brand.toNumber() ? this.drugTypes.brand : this.drugTypes.generic).toNumber(),
                        drugSource: (this.drugSourceToNumber() === this.drugSources.OTC.toNumber() ? this.drugSources.OTC : this.drugSources.prescription).toNumber(),
                    });
                    $http.post('https://openfda.intellectsolutions.com:8000/openfda/query', query).success(function (data, status, headers, config) {
                        if (exoTools.isDefined(data) && exoTools.isArray(data.results)) {
                            var results = data.results;
                            var enumerable = exoTools.collections.asEnumerable(results);
                            $this.dataSet = results;
                        }
                    }).error(function (data, status, headers, config) {
                        $log.log(data);
                    });
                }
                break;
            default:
                break;
        }
    };
    var defaultReaction = new exoTools.keyValuePair(0, 'Drug Ineffective');
    var defaultDemograph = new exoTools.keyValuePair(0, 'Any');
    this.selectedReaction = defaultReaction.key;
    this.selectedDemograph = defaultDemograph.key;
    this.adverseReactionsList = [
        new exoTools.keyValuePair(0, 'Drug Ineffective'),
        new exoTools.keyValuePair(1, 'Nausea'),
        new exoTools.keyValuePair(2, 'Death'),
        new exoTools.keyValuePair(3, 'Headache'),
        new exoTools.keyValuePair(4, 'Dysponea'),
        new exoTools.keyValuePair(5, 'Pain'),
        new exoTools.keyValuePair(6, 'Dizziness'),
        new exoTools.keyValuePair(7, 'Vomiting'),
        new exoTools.keyValuePair(8, 'Diarrhoea'),
        new exoTools.keyValuePair(9, 'Fatigue')
    ];
    this.patientDemographicsList = [
        new exoTools.keyValuePair(0, 'Any'),
        new exoTools.keyValuePair(1, 'Females < 21'),
        new exoTools.keyValuePair(2, 'Females 22 - 60'),
        new exoTools.keyValuePair(3, 'Females 61 - 90'),
        new exoTools.keyValuePair(4, 'Females > 90'),
        new exoTools.keyValuePair(5, 'Males < 21'),
        new exoTools.keyValuePair(6, 'Males 22 - 60'),
        new exoTools.keyValuePair(7, 'Males 61 - 90'),
        new exoTools.keyValuePair(8, 'Males > 90'),
    ];
    this.compileList();
    this.displayData(1);
}]);