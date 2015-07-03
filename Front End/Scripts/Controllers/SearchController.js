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
    };
    this.isMobile = function () {
        return window.isMobile();
    };
    //Chart height and width
    this.chartWidth = this.isMobile() ? 300 : 1000;
    this.chartHeight = this.isMobile() ? 100 : 300;
    //End chart height and width
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
                var enumerable = exoTools.collections.asEnumerable(results).orderBy('term', 'asc');
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
                $this.displayData(1);
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
        OTC: new EnumMember(0, 'Over the Counter'),
        prescription: new EnumMember(1, 'Prescription'),
    });
    var defaultDataSet = {
        terms: [],
        _type: 'terms',
        other: 0,
        total: 0,
        missing: 0
    };
    this.dataSet = defaultDataSet;
    this.hasNoRecords = false;
    this.hasDrugName = false;
    var updateNoRecords = function (query) {
        if (exoTools.isDefined(query)) {
            $this.noRecordsMessage = query.count() <= 0 ? "No records found" : "";
            $this.hasNoRecords = query.count() <= 0 ? true : false;
        } else {
            $this.noRecordsMessage = "No records found";
            $this.hasNoRecords = true;
        }
    };
    this.setTableHeight = function () {
        return {
            'min-height': this.hasNoRecords ? 'initial' : '500px',
            'padding-left': this.hasNoRecords ? '25px' : 'inherit'
        };
    };
    this.calculateStyle = function (term) {
        if (term.count) {
            var width = 0,
                count = term.count,
                maxWidth = this.isMobile() ? ($(window).width() * .95) : 800,
                maxCount = this.dataSet.terms[0].count,
                width = (count / maxCount) * maxWidth;
            return {
                'width': exoTools.stringFormatter('{0}px', width)
            };
        }
        return {};
    };
    this.displayData = function (queryType) {
        this.hasDrugName = this.drugName.value !== defaultListItem.value;
        this.dataSet = defaultDataSet;
        this.noRecordsMessage = "";
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
                        var names = new exoTools.collections.list();
                        var orderByIncidence = enumerable.orderBy('count', 'desc').take(10).select(function (item) {
                            if (item.term.length > 25) {
                                var format = "{0}...";
                                var string = exoTools.stringFormatter(format, item.term.substring(0, 25).trim());
                                item.term = string;
                            }
                            return item;
                        });
                        $this.dataSet = {
                            _type: 'terms',
                            other: 0,
                            missing: 0,
                            terms: orderByIncidence.toArray(),
                            total: orderByIncidence.count()
                        };
                        updateNoRecords(orderByIncidence);
                    }
                }).error(function (data, status, headers, config) {
                    $log.log(data);
                    updateNoRecords();
                });
                break;
            case 2:
                if (exoTools.isDefined(this.drugName) && this.drugName.id !== defaultListItem.id) {
                    var query = new Query({
                        queryType: 2,
                        drugName: this.drugName.value,
                        filterIndex: exoTools.convert.toNumber(this.selectedDemograph),
                        drugType: (this.drugTypeToNumber() === this.drugTypes.brand.toNumber() ? this.drugTypes.brand : this.drugTypes.generic).toNumber(),
                        drugSource: (this.drugSourceToNumber() === this.drugSources.OTC.toNumber() ? this.drugSources.OTC : this.drugSources.prescription).toNumber(),
                    });
                    $log.log(query);
                    $http.post('https://openfda.intellectsolutions.com:8000/openfda/query', query).success(function (data, status, headers, config) {
                        if (exoTools.isDefined(data) && exoTools.isArray(data.results)) {
                            var results = data.results;
                            var enumerable = exoTools.collections.asEnumerable(results);
                            var orderByIncidence = enumerable.orderBy('count', 'desc').take(10).select(function (item) {
                                if (item.term.length > 25) {
                                    var format = "{0}...";
                                    var string = exoTools.stringFormatter(format, item.term.substring(0, 25).trim());
                                    item.term = string;
                                }
                                return item;
                            });;
                            $this.dataSet = {
                                _type: 'terms',
                                other: 0,
                                missing: 0,
                                terms: orderByIncidence.toArray(),
                                total: orderByIncidence.count()
                            };
                            updateNoRecords(orderByIncidence);
                        }
                    }).error(function (data, status, headers, config) {
                        updateNoRecords();
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
                            $this.displayData(2);
                        }
                    }).error(function (data, status, headers, config) {
                        $log.log(data);
                    });
                } else {
                    this.displayData(1);
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
        new exoTools.keyValuePair(4, 'Dyspnoea'),
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