#!/bin/bash
while true
do
	MSG=`date +'hello %s'`
	logger $MSG
	sleep 2
done

