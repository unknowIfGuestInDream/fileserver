#!/bin/bash

#
# Copyright (c) 2024 unknowIfGuestInDream.
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#     * Redistributions of source code must retain the above copyright
# notice, this list of conditions and the following disclaimer.
#     * Redistributions in binary form must reproduce the above copyright
# notice, this list of conditions and the following disclaimer in the
# documentation and/or other materials provided with the distribution.
#     * Neither the name of unknowIfGuestInDream, any associated website, nor the
# names of its contributors may be used to endorse or promote products
# derived from this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL UNKNOWIFGUESTINDREAM BE LIABLE FOR ANY
# DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
# (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
# ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
# SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#

APP_NAME=fileserver.jar


usage() {
echo "Usage: sh fileserver.sh [start|stop|restart|status]"
exit 1
}


is_exist() {
pid=`ps -ef | grep $APP_NAME | grep -v grep | awk '{print $2}' `

if [ -z "${pid}" ]
then
 return 1
else
 return 0
fi
}


start() {
is_exist
if [ $? -eq "0" ]
then
 echo "${APP_NAME} is already running. pid=${pid} ."
else
 nohup java -jar $APP_NAME > /dev/null 2>&1 &
fi
}

#停止方法
stop() {
is_exist
if [ $? -eq "0" ]
then
 kill -9 $pid
else
 echo "${APP_NAME} is not running"
fi
}

#输出运行状态
status() {
   is_exist
if [ $? -eq "0" ]
then
     echo "${APP_NAME} is running. Pid is ${pid}"
else
     echo "${APP_NAME} is not running."
fi
}

#重启
restart() {
  stop
  start
}

#根据输入参数，选择执行对应方法，不输入则执行使用说明
case "$1" in
"start")
start
;;
"stop")
stop
;;
"status")
status
;;
"restart")
restart
;;
*)
usage
;;
esac
