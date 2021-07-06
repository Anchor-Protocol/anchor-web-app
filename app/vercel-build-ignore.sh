#!/bin/bash

pwd;
git diff --quiet HEAD^ HEAD ../{packages,app}/{src,public};