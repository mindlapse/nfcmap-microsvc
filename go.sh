echo Relaunching nfcmap-microsvc
if [ -f .pid ]; then
	kill -9 `cat .pid`
fi
nfcmap/bin/nfcmap-microsvc > ./nfcmap.log 2>&1 &
echo $! > .pid