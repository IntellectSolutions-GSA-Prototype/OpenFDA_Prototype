app.controller('SearchController', ['$routeParams', '$http', '$log', function ($routeParams, $http, $log) {
    //Maintain the global scope.
    var $this = this;
    //The title of the application
    this.title = "ADERS";
    this.context = null;
    //Set the application page title for the current view context.
    this.setPageTitle = function () {
        window.setPageTitle('ADERS');
    };
    //The model for the drug type for the query.
    this.drugType = 0;
    //Converts the model value to a number for easy enum indexing.
    this.drugTypeToNumber = function () {
        return exoTools.convert.toNumber(this.drugType);
    };
    //The model for the drug source for the query.
    this.drugSource = 1;
    //Converts the model value to a number for easy enum indexing.
    this.drugSourceToNumber = function () {
        return exoTools.convert.toNumber(this.drugSource);
    };
    //The default list item for the medicine name list.
    var defaultListItem = {
        id: -1,
        value: 'Select a Medicine Name'
    };
    //Indicates if the application is operating in mobile mode or not.
    this.isMobile = function () {
        return window.isMobile();
    };
    //Chart height and width
    this.chartWidth = this.isMobile() ? 300 : ($(window).width() * .70 * .95);
    this.chartHeight = this.isMobile() ? 100 : 300;
    //End chart height and width
    //The model for the drug name for the query.
    this.drugName = defaultListItem;
    //The list of list items for the medicine name SELECT element.
    this.listItems = [defaultListItem];
    //Compiles the list of medicine names for the query.
    this.compileList = function () {
        //Initializes the list items to the default list.
        this.listItems = [defaultListItem];
        //Intializes the model value.
        this.drugName = defaultListItem;
        //Handle all errors generically.
        var errorHanlder = function (data, status, headers, config) {
            $log.log('There was an error retrieving drug names...')
        };
        //Handle all successes generically.
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
        //Drug type is OTC brand.
        if (this.drugTypeToNumber() === this.drugTypes.brand.toNumber() && this.drugSourceToNumber() === this.drugSources.OTC.toNumber()) {
            $http.get('https://openfda.intellectsolutions.com:8000/openfda/listBrandNameOTCDrugs')
            .success(function (data, status, headers, config) {
                successHandler(data, status, headers, config);
            })
            .error(function (data, status, headers, config) {
                errorHanlder(data, status, headers, config);
            });
            //Drug type is prescription brand.
        } else if (this.drugTypeToNumber() === this.drugTypes.brand.toNumber() && this.drugSourceToNumber() === this.drugSources.prescription.toNumber()) {
            $http.get('https://openfda.intellectsolutions.com:8000/openfda/listBrandNamePresDrugs')
            .success(function (data, status, headers, config) {
                successHandler(data, status, headers, config);
            })
            .error(function (data, status, headers, config) {
                errorHanlder(data, status, headers, config);
            });
            //Drug type is OTC generic.
        } else if (this.drugTypeToNumber() === this.drugTypes.generic.toNumber() && this.drugSourceToNumber() === this.drugSources.OTC.toNumber()) {
            $http.get('https://openfda.intellectsolutions.com:8000/openfda/listGenericOTCDrugs')
            .success(function (data, status, headers, config) {
                successHandler(data, status, headers, config);
            })
            .error(function (data, status, headers, config) {
                errorHanlder(data, status, headers, config);
            });
            //Drug type is prescription generic.
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
    //Enum that represents the drug types for the query.
    this.drugTypes = new Enum({
        brand: new EnumMember(0, 'Brand Name'),
        generic: new EnumMember(1, 'Generic')
    });
    //Enum that represents the drug source for the query.
    this.drugSources = new Enum({
        OTC: new EnumMember(0, 'Over the Counter'),
        prescription: new EnumMember(1, 'Prescription'),
    });
    //Initialize the default label.
    var defaultLabelSet = {
        _type: 'label',
        description_label: '',
        precautions_label: '',
        package_label: '',
        warning_label: ''
    };
    //Init the default dataset.
    var defaultDataSet = {
        terms: [],
        _type: 'terms',
        other: 0,
        total: 0,
        missing: 0
    };
    //Set the model state to the default label set.
    this.labelSet = defaultLabelSet;
    //Set the model state to the default dataset.
    this.dataSet = defaultDataSet;
    //Indicates that the query returned no results.
    this.hasNoRecords = false;
    //Indicates that no drug name was selected and the query mode is operating based on reactions.
    this.hasDrugName = false;
    //Updates the no records status.
    var updateNoRecords = function (query) {
        if (exoTools.isDefined(query)) {
            $this.noRecordsMessage = query.count() <= 0 ? "No records found" : "";
            $this.hasNoRecords = query.count() <= 0 ? true : false;
        } else {
            $this.noRecordsMessage = "No records found";
            $this.hasNoRecords = true;
        }
    };
    //Sets the table height for the query results data viz.
    this.setTableHeight = function () {
        return {
            'min-height': this.hasNoRecords ? 'initial' : '400px',
            'padding-left': this.hasNoRecords ? '25px' : 'inherit'
        };
    };
    //Sets the calculated style of the data table.
    this.calculateStyle = function (term) {
        if (term.count) {
            var width = 0,
                count = term.count,
                maxWidth = this.isMobile() ? ($(window).width() * .95) : ($(window).width() * .70 * .95),
                maxCount = this.dataSet.terms[0].count,
                width = (count / maxCount) * maxWidth;
            return {
                'width': exoTools.stringFormatter('{0}px', width)
            };
        }
        return {};
    };
    //Displays the data for the data visualization.
    this.displayData = function (queryType) {
        this.hasDrugName = this.drugName.value !== defaultListItem.value;
        this.dataSet = defaultDataSet;
        this.noRecordsMessage = "";
        switch (queryType) {
            //The query is looking up based on reactions.
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
                //The query type is looking up based on drug name.
            case 2:
                if (exoTools.isDefined(this.drugName) && this.drugName.id !== defaultListItem.id) {
                    var query = new Query({
                        queryType: 2,
                        drugName: this.drugName.value,
                        filterIndex: exoTools.convert.toNumber(this.selectedDemograph),
                        drugType: (this.drugTypeToNumber() === this.drugTypes.brand.toNumber() ? this.drugTypes.brand : this.drugTypes.generic).toNumber(),
                        drugSource: (this.drugSourceToNumber() === this.drugSources.OTC.toNumber() ? this.drugSources.OTC : this.drugSources.prescription).toNumber(),
                    });
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
                        updateNoRecords();
                    });
                }
                break;
                //The query is looking up labels.
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
                            var hasResultProperty = function (propName) {
                                var exists = false;
                                if (exoTools.isDefined(results)) {
                                    var property = results[0][propName];
                                    if (exoTools.isDefined(property)) {
                                        exists = exoTools.isDefined(property[0]);
                                    }
                                }
                                return exists;
                            };
                            $this.labelSet = {
                                _type: 'label',
                                description_label: hasResultProperty('description') ? results[0].description[0] : "No description returned.",
                                precautions_label: hasResultProperty('precautions') ? results[0].precautions[0] : 'No precautions returned.',
                                package_label: hasResultProperty('package_label_principal_display_panel') ? results[0].package_label_principal_display_panel[0] : 'No package label returned.',
                                warning_label: hasResultProperty('warnings') ? results[0].warnings[0] : 'No warning label returned.'
                            };
                            $log.log($this.labelSet);
                            $this.displayData(2);  // Submit the Type 2 Query as well to display result set of adverse reaction for selected medicine.
                        }
                    }).error(function (data, status, headers, config) {
                        $this.labelSet = {
                            _type: 'label',
                            description_label: 'No Description Returned. Please try again later.',
                            precautions_label: 'No Precautions Returned. Please try again later',
                            package_label: 'No Packaging Label Returned. Please try again later',
                            warning_label: 'No Warning Label Returned. Please try again later'
                        };
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
    //Init default adverse reaction for model.
    var defaultReaction = new exoTools.keyValuePair(0, 'Drug Ineffective');
    //Init default demograph for model.
    var defaultDemograph = new exoTools.keyValuePair(0, 'Any');
    //Set default reaction.
    this.selectedReaction = defaultReaction.key;
    //Set default demograph.
    this.selectedDemograph = defaultDemograph.key;
    //Adverse reactions list: static.
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
    //Demographics list: static.
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
    //Perform queries on init.
    this.compileList();
    this.displayData(1);
}]);