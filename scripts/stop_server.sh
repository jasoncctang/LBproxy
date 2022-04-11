#!/bin/bash
cd /var/www/html/

isExistApp = `pgrep httpd`
if [[ -n  $isExistApp ]]; then
    service httpd stop
fi

yum remove -y httpd

pm2 stop all