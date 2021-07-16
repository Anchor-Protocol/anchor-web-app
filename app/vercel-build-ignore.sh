#!/bin/bash

pwd;
git diff --quiet HEAD^ HEAD ./{src,public};