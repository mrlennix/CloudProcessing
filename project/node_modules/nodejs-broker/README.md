# Nodejs-Broker
nodejs broker is an operation broker that narrows down multiple operations of the same type being executed to a single operation, while an operation is under execution every other operation of the same type blocks on that operation pending for its results

Version: 0.1.4

## How it works
Suppose you have a database which contains 10K records and these records are being queried by millions of users. Assume in a given moment 100 requests are being processed to read the same record for 100 users this seems like a huge waste. Or assume that you have a website and an article on your website has gone viral, serving the same article many times at the same moment also seems like a huge waste.
Nodejs-Broker allows you to process only one type of the operation reading the same set of data and all other equivalent operations block on that operation. Hence, lower response time and better resource utilization.
Some might argue that such functionality makes errors impact higher, instead of failing a single request/operation, hunderds of operations will fail. That I can't argue with but hunderds of operations failing at once better than failing one on its own.
To lower the error impact a retrial count is provided with each broker, however this retrial count is a hard limit. In ideal cases, an operation is retried by the number of operations pending for the result. For example, If 3 requests are passed to a broker at the same instance with retrial hard limit 5 an operation can be retried up to 3 times, we call this "operation rank".

## Limits
Nodejs-Broker operations for the time being can only be promise (http://promisejs.com)

## An Operation
An operation should have (type, key, value[optional])
an operation type can either be (read, create, update, delete, insert).
all types of operations must have a key
operations of the same key block on each others
operations such as (create, update, insert) must have a value.

## Example
Coffeescript
```coffeescript
NBroker = require("nodejs-broker")
b = new NBroker.Broker("My Custom Broker", 5) // 5 is the retrial hard limit
class ReadOp
  constructor:(@key) ->
    return
  commit:() ->
    self = @
    return new Promise((fulfill, reject) ->
      request.get(self.key, (errs, response, body) ->
        if !errs
          fulfill body
      )
    )

b.execute ReadOp, "read", "http://example.com"
```

Javascript
```javascript
const NBroker = require("nodejs-broker")
b = new NBroker.Broker("My Custom Broker", 5)

var ReadOp = function(key){
  this.key = key
}
ReadOp.prototype.commit = function(){
  var self = this
  return new Promise(function(fulfill, reject) {
      request.get(self.key, function(errs, response, body){
          if (!errs)
            fulfill(body)
        }
      )
    }
  )
}

b.execute(ReadOp, "read", "http://example.com")
```


## Broker Operations
You might find defining a new class for each operation is too much of a hassle. However, you shouldn't use a broker if it's not worth it.
To lessen the hassle, Nodejs-Broker provides a base class called BrokerOp which you can inherit from. However your promise should always be wrapped in an uninstansiated type to avoid being triggered.

## Using BrokerOp
```coffeescript
NBroker = require("nodejs-broker")
b = new NBroker.Broker("My Custom Broker", 5) // 5 is the retrial hard limit
class ReadOp extends NBroker.BrokerOp
  commit:() ->
    self = @
    return new Promise((fulfill, reject) ->
      request.get(self.key, (errs, response, body) ->
        if !errs
          fulfill body
      )
    )

b.execute ReadOp, "read", "http://example.com"
```

Javascript
```javascript
const NBroker = require("nodejs-broker")
b = new NBroker.Broker("My Custom Broker", 5)

var ReadOp = function(){}
util.inherits(ReadOp, NBroker.BrokerOp)

ReadOp.prototype.commit = function(){
  var self = this
  return new Promise(function(fulfill, reject) {
      request.get(self.key, function(errs, response, body){
          if (!errs)
            fulfill(body)
        }
      )
    }
  )
}

b.execute(ReadOp, "read", "http://example.com")
```


## Testing Nodejs-Broker limits

This script creates a readop which invokes a request for http://example.com 100 times. In standard cases, 100 times will take ages to complete. However, since only one request is invoked all 100 operations are fulfilled after one operation is complete.

```coffeescript
request = require("request")
NBroker = require("nodejs-broker")

b = new NBroker.Broker("My Custom Broker", 5) # 5 is the retrial hard limit
passedreq = 0

class ReadOp extends NBroker.BrokerOp
  commit:() ->
    self = @
    return new Promise((fulfill, reject) ->
      request.get(self.key, (errs, response, body) ->
        if !errs
          console.log("Request passed")
          fulfill body
      )
    )
    
for i in [1..100]
    (b.execute ReadOp, "read", "http://example.com")
```
Try this on your machine.
