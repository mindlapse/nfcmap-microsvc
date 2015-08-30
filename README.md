# nfcmap-microsvc
NFC tags hardcoded to this endpoint are mapped to redirect URLs

Name:	nfcmap-microsvc
Desc:	An app server that provides these functions:

-	Register a new tag, returns tagId
-	Set the redirectURL for the tag


Aspects:
-	The app server used is a node express server.
-	Backed by a mysql database, stores data in the nfctag table.
-	Open source on GitHub (clone: https://github.com/mindlapse/nfcmap-microsvc.git)
-	MIT licensed.