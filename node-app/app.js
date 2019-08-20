/**
* @date: 8/19/2019
* @desc The handler is to fetch data of food turnks that are available on the day the users run this program.
*/
'use strict';

/**
 * @desc This handler is in singleton pattern and hosts three functions, fetchData(), printData(), and printMore(), that are all unit-test friendly.
 *       All required modules are imported as soon as the handler gets created.
 */
const handler = {
    // import all required modules
    rp: require('request-promise'),
    moment: require('moment'),
    readline: require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    }),
    /**
     * Fetch data with the provided options and return Promise
     * @param {obj} options
     * @return {Promise}
     */
    fetchData: function(options) {
        const self = this;

        console.log('Sart fetching data...');
        return this.rp(options)
                .then((resp) => {
                    /** @type {!Array<obj>} */
                    let aryFoodTrunks = [];

                    // Only start the operations of filtering out data, printing result, and iterating the array of the available food turnks
                    if (resp && resp.length > 0) {
                        aryFoodTrunks = resp.filter((obj) => {
                                            // filter out the food trunk that are not available today
                                            return obj.dayofweekstr == self.moment().format('dddd');
                                        })
                                        .filter((obj) => {
                                            // Filter out the food trunk 
                                            // by checking if the current time within the beginning time and the end time of the food trunk
                                            /** @type {datetime} */
                                            const beginningTime = self.moment(obj.starttime, ['hA']);
                                            /** @type {datetime} */
                                            const endTime = self.moment(obj.endtime, ['hA']);
                                            /** @type {datetime} */
                                            const currentTime = self.moment();

                                            return (beginningTime.isBefore(currentTime) && currentTime.isBefore(endTime));
                                        })
                                        .sort(function(fisrtObj, secObj){
                                            // Sort the ary by comparing the applicants' names
                                            // Note: If the performance of the built-in sorting mechanism is not good,
                                            //       the developers can write their own sorting algorithm.
                                            if(fisrtObj.applicant < secObj.applicant) { return -1; }
                                            if(fisrtObj.applicant > secObj.applicant) { return 1; }
                                            return 0;
                                        });
                    }

                    return Promise.resolve(aryFoodTrunks);
                }, (reason) => {
                    console.log(reason);
                    process.exit();
                });
    },
    /**
     * Create and return a iterator/generator
     * @param {obj} objIteratorParams
     * @return {object} objIteratorParams = generator
     */
    createIterator: function(objIteratorParams) {
        function* iteratorFoodTrunks(objIteratorParams) {
            while(true) {
                // Return sub arrary within the range of startIndex and endIndex
                yield objIteratorParams.aryFoodTrunks
                        .slice(objIteratorParams.startIndex + objIteratorParams.step * objIteratorParams.count,
                            objIteratorParams.endIndex + objIteratorParams.step * objIteratorParams.count);              
                objIteratorParams.count++;
            }
        }

        // Create iterator
        const iterator = iteratorFoodTrunks(objIteratorParams);

        return Promise.resolve({
            objIteratorParams: objIteratorParams,
            iterator: iterator
        });
    },
    /**
     * Iterate data array and print the data in the required format
     * @param {obj} params
     */
    printData: function(params) {
        // first round of printing data
        const subAryFoodTrunks = params.iterator
                                    .next()
                                    .value
                                    .map((obj) => {
                                        /** @type {string} */
                                        const str = `NAME & ADDRESS: ${obj.applicant} ; ${obj.location}`;
                                        return str;
                                    });

        // Print result
        console.log(subAryFoodTrunks);

        // Stop the following operation if no more data to print
        if (params.objIteratorParams.aryFoodTrunks.length < params.objIteratorParams.endIndex) {
            process.exit();
        } else {
            this.printMore(params);
        }
    },
    /**
     * Iterate data array and print more data in the required format
     * @param {obj} params
     */
    printMore: function(params) {
        const self = this;
        /** @type {!Array<obj>} */
        const tmpVal = params.iterator.next().value;

        if (!Array.isArray(tmpVal) || tmpVal.length == 0) {
            // Terminate readline and process if value is not array or length is equal to zero.
            self.readline.close();
            process.exit();
        } else {
            // Question string
            const strQuestoin = `Print more data `+
                `(${params.objIteratorParams.aryFoodTrunks.length - (params.objIteratorParams.step * params.objIteratorParams.count)} ` +
                `remaining in the list)? (yes)`;

            // Read answer
            self.readline
                .question(strQuestoin, (answer) => {
                    if (answer === 'yes') {
                        // Rebuild the array to match the format
                        const aryFoodTrunks = tmpVal.map((obj) => {
                            const str = `NAME & ADDRESS: ${obj.applicant} ; ${obj.location}`;
                            return str;
                        });

                        // Print result
                        console.log(aryFoodTrunks);

                        // Recursive call to print more data
                        self.printMore(params);                                                                                                               
                    } else {
                        // Terminate readline and process
                        self.readline.close();
                        process.exit();
                    }
                });
        };
    }
};


/** Start the actions:
 *      All actions are executed in Promise chain.
 *      Promise chain is a good mechanism because of following reasons:
 *      1. Good for handling async/sync in sequence.
 *      2. Good for eliminating an extra variable for each intermediate step.
 *      3. Good for improving readability
 */
handler
    .fetchData({
        uri: 'http://data.sfgov.org/resource/bbb8-hzi6.json', // API url/uri
        headers: {
            'User-Agent': 'Request-Promise' // set user agent
        },
        json: true // automatically parses the JSON string in the response
    })
    .then((aryFoodTrunks) => {
        /** This step is to create a generator and pass it to next then() */
        if (aryFoodTrunks.length == 0) {
            console.log('No food trunk available at this moment!');
            process.exit();
        }

        console.log('Parsing data...');
        return handler.createIterator({
                    count: 0, // offset of the sub array
                    startIndex: 0, // start index of the sub array
                    endIndex: 10, // end index of the sub array
                    step: 10, // how many array items to show
                    aryFoodTrunks: aryFoodTrunks
                });
    }, (reason) => {
        console.log(reason);
        process.exit();
    })
    .then((params) => {
        /** This step is to print data */
        handler.printData(params);
    }, (reason) => {
        console.log(reason);
        process.exit();
    })
    .catch((err) => {
        console.log(err);
    });
