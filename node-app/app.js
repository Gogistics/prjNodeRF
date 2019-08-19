/**
* @date: 8/19/2019
* @desc The handler is to fetch data of food turnks that are available on the day the users run this program.
*/
'use strict';

/** This is handler in singleton pattern. */
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

                    // only start the operations of printing result and iterating the array of the available food turnks
                    if (resp && resp.length > 0) {
                        aryFoodTrunks = resp.filter((obj) => {
                                            // filter out the food trunk that are not available today
                                            return obj.dayofweekstr == self.moment().format('dddd');
                                        })
                                        .filter((obj) => {
                                            // filter out the food trunk 
                                            // by checking if the current time within the beginning time and the end time of the food trunk
                                            const beginningTime = self.moment(obj.starttime, ['hA']);
                                            const endTime = self.moment(obj.endtime, ['hA']);
                                            const currentTime = self.moment();

                                            return (beginningTime.isBefore(currentTime) && currentTime.isBefore(endTime));
                                        })
                                        .sort(function(fisrtObj, secObj){
                                            // sort the ary by comparing the applicants' names
                                            // Note: if the performance of the built-in sorting mechanism is not good,
                                            //       the developers can write their own sorting algorithm
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
                // return sub arrary within the range of startIndex and endIndex
                yield objIteratorParams.aryFoodTrunks
                        .slice(objIteratorParams.startIndex + objIteratorParams.step * objIteratorParams.count,
                            objIteratorParams.endIndex + objIteratorParams.step * objIteratorParams.count);              
                objIteratorParams.count++;
            }
        }

        // create iterator
        const iterator = iteratorFoodTrunks(objIteratorParams);

        return Promise.resolve({
            totalLength: objIteratorParams.aryFoodTrunks.length,
            endIndex: objIteratorParams.endIndex,
            step: objIteratorParams.step,
            count: objIteratorParams.count,
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
                                    const str = `NAME & ADDRESS: ${obj.applicant} ; ${obj.location}`;
                                    return str;
                                });

        // print result
        console.log(subAryFoodTrunks);

        // stop the following operation if no more data to print
        if (params.totalLength < params.endIndex) {
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
        const tmpVal = params.iterator.next().value;

        if (!Array.isArray(tmpVal) || tmpVal.length == 0) {
            // terminate readline and process
            self.readline.close();
            process.exit();
        } else {
            // question string
            const strQuestoin = `Print more data `+
                `(${params.totalLength - params.step * params.count} ` +
                `remaining in the list)? (yes)`;

            // read answer
            self.readline
                .question(strQuestoin, (answer) => {
                    if (answer === 'yes') {
                        // 
                        const aryFoodTrunks = tmpVal.map((obj) => {
                            const str = `NAME & ADDRESS: ${obj.applicant} ; ${obj.location}`;
                            return str;
                        });

                        // print result
                        console.log(aryFoodTrunks);

                        // recursive call to print more data
                        self.printMore(params);                                                                                                               
                    } else {
                        // terminate readline and process
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
        uri: 'http://data.sfgov.org/resource/bbb8-hzi6.json',
        headers: {
            'User-Agent': 'Request-Promise' // set user agent
        },
        json: true // automatically parses the JSON string in the response
    })
    .then((aryFoodTrunks) => {
        if (aryFoodTrunks.length == 0) {
            console.log('No food trunk available at this moment!');
            process.exit();
        }

        console.log('Parsing data...');
        return handler.createIterator({
                    count: 0,
                    startIndex: 0,
                    endIndex: 10,
                    step: 10,
                    aryFoodTrunks: aryFoodTrunks
                });
    }, (reason) => {
        console.log(reason);
        process.exit();
    })
    .then((iterator) => {
        // console.log(iterator);
        handler.printData(iterator);
    }, (reason) => {
        console.log(reason);
        process.exit();
    })
    .catch((err) => {
        console.log(err);
    });
