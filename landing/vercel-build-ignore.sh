#!/bin/bash

pwd;
git diff --quiet HEAD^ HEAD ../{packages,landing}/{src,public};