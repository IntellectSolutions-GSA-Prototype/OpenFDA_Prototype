#!/bin/sh
#
# Use curl to scan site interface and validate pages are returning correctly
#
# Define Script Variables
WEB_TEST_OUT=$HOME/webTest
CURLAPP="/usr/bin/curl"
CATAPP="/bin/cat"
GREPAPP="/bin/grep"

if [ -d $WEB_TEST_OUT ]; then
        echo "$WEB_TEST_OUT Available"
else
        mkdir $WEB_TEST_OUT
        echo "$WEB_TEST_OUT Created"
fi

echo "Testing Home Page"
$CURLAPP --trace-ascii $WEB_TEST_OUT/aders_home.out --trace-time -o /dev/null --ciphers ecdhe_rsa_aes_128_gcm_sha_256 https://openfda.intellectsolutions.com
echo "Testing Our Solution Page"
$CURLAPP --trace-ascii $WEB_TEST_OUT/aders_oursolution.out --trace-time -o /dev/null --ciphers ecdhe_rsa_aes_128_gcm_sha_256 https://openfda.intellectsolutions.com/#/Video
echo "Testing Drug Search Page"
$CURLAPP --trace-ascii $WEB_TEST_OUT/aders_drugsearch.out --trace-time -o /dev/null --ciphers ecdhe_rsa_aes_128_gcm_sha_256 https://openfda.intellectsolutions.com/#/Search
echo "Testing Feedback Page"
$CURLAPP --trace-ascii $WEB_TEST_OUT/aders_feedback.out --trace-time -o /dev/null --ciphers ecdhe_rsa_aes_128_gcm_sha_256 https://openfda.intellectsolutions.com/#/Feedback
echo "Testing About Us Page"
$CURLAPP --trace-ascii $WEB_TEST_OUT/aders_aboutus.out --trace-time -o /dev/null --ciphers ecdhe_rsa_aes_128_gcm_sha_256 https://openfda.intellectsolutions.com/#/About
echo "Testing Legal Page"
$CURLAPP --trace-ascii $WEB_TEST_OUT/aders_legal.out --trace-time -o /dev/null --ciphers ecdhe_rsa_aes_128_gcm_sha_256 https://openfda.intellectsolutions.com/#/Legal
echo "Testing Privacy Page"
$CURLAPP --trace-ascii $WEB_TEST_OUT/aders_privacy.out --trace-time -o /dev/null --ciphers ecdhe_rsa_aes_128_gcm_sha_256 https://openfda.intellectsolutions.com/#/Privacy

echo "Checking for Errors"
$CATAPP $WEB_TEST_OUT/*.out | $GREPAPP 404
echo "Testing Complete"
