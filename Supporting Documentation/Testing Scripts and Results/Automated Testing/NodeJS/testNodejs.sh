#!/bin/sh
#
# Use curl to scan site interface and validate pages are returning correctly
#
# Define Script Variables
WEB_TEST_OUT=$HOME/nodeTest
CURLAPP="/usr/bin/curl"
CATAPP="/bin/cat"
GREPAPP="/bin/grep"

if [ -d $WEB_TEST_OUT ]; then
        echo "$WEB_TEST_OUT Available"
else
        mkdir $WEB_TEST_OUT
        echo "$WEB_TEST_OUT Created"
fi

echo "Testing Clear Cache"
$CURLAPP --insecure --trace-ascii $WEB_TEST_OUT/clearCache.out --trace-time -o /dev/null --ciphers ecdhe_rsa_aes_128_gcm_sha_256 \
	https://openfda.intellectsolutions.com:8000/openfda/clearCache
echo "Testing List Brand Name OTC Drugs"
$CURLAPP --insecure --trace-ascii $WEB_TEST_OUT/listBrandNameOTC.out --trace-time -o /dev/null --ciphers ecdhe_rsa_aes_128_gcm_sha_256 \
	https://openfda.intellectsolutions.com:8000/openfda/listBrandNameOTCDrugs
echo "Testing List Brand Name Prescription Drugs"
$CURLAPP --insecure --trace-ascii $WEB_TEST_OUT/listBrandNamePrescription.out --trace-time -o /dev/null --ciphers ecdhe_rsa_aes_128_gcm_sha_256 \
	https://openfda.intellectsolutions.com:8000/openfda/listBrandNamePRESDrugs
echo "Testing List Generic OTC Drugs"
$CURLAPP --insecure --trace-ascii $WEB_TEST_OUT/listGenericOTC.out --trace-time -o /dev/null --ciphers ecdhe_rsa_aes_128_gcm_sha_256 \
	https://openfda.intellectsolutions.com:8000/openfda/listGenericOTCDrugs
echo "Testing List Generic Prescription Drugs"
$CURLAPP --insecure --trace-ascii $WEB_TEST_OUT/listGenericPrescription.out --trace-time -o /dev/null --ciphers ecdhe_rsa_aes_128_gcm_sha_256 \
	https://openfda.intellectsolutions.com:8000/openfda/listGenericPRESDrugs
echo "Testing Query Submit Type 1 Query"
$CURLAPP -H "Content-Type: application/json" -X POST -d '{"QueryParameters":{"drugType":0,"drugSource":1,"drugName":"BYETTA","filterIndex":4,"queryType":1}}' \
	--insecure --trace-ascii $WEB_TEST_OUT/queryType1.out --trace-time -o /dev/null --ciphers ecdhe_rsa_aes_128_gcm_sha_256 https://openfda.intellectsolutions.com:8000/openfda/query
echo "Testing Query Submit Type 2 Query"
$CURLAPP -H "Content-Type: application/json" -X POST -d '{"QueryParameters":{"drugType":0,"drugSource":1,"drugName":"BYETTA","filterIndex":4,"queryType":2}}' \
	--insecure --trace-ascii $WEB_TEST_OUT/queryType2.out --trace-time -o /dev/null --ciphers ecdhe_rsa_aes_128_gcm_sha_256 https://openfda.intellectsolutions.com:8000/openfda/query
echo "Testing Query Submit Type 3 Query"
$CURLAPP -H "Content-Type: application/json" -X POST -d '{"QueryParameters":{"drugType":0,"drugSource":1,"drugName":"BYETTA","filterIndex":4,"queryType":3}}' \
	--insecure --trace-ascii $WEB_TEST_OUT/queryType3.out --trace-time -o /dev/null --ciphers ecdhe_rsa_aes_128_gcm_sha_256 https://openfda.intellectsolutions.com:8000/openfda/query

echo "Checking for Errors"
$CATAPP $WEB_TEST_OUT/*.out | $GREPAPP 404
echo "Testing Complete"
