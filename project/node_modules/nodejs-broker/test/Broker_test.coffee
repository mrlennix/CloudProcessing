NBroker = require "../src/broker"
assert = require "assert"
Promise = require "promise"

broker = null
counter = 0
process.env.BROKER_RETRY_LIMIT = 5

class TestFailingTransaction extends NBroker.BrokerOp
    #constructor: (@key) ->
    #    return
    commit: () ->
        counter +=1
        # return a promise that fails after 100 msecond
        return new Promise((fulfill, reject) ->
            setTimeout(
                () -> reject null,
                50
            )
        )

class TestFulfillingTransaction extends NBroker.BrokerOp
    #constructor: (@key) ->
    #    return
    commit: () ->
        # return a promise that fails after 100 msecond
        return new Promise((fulfill, reject) ->
            fulfill null
        )
describe "Broker Tests", () ->

  beforeEach () ->
    counter = 0
    broker = new NBroker.Broker("Test Broker", 5)

  afterEach () ->
    broker = null

  it "Broker bucket init/cleanup test", () ->
      operation = broker.execute TestFailingTransaction, "read", "dummy"
      assert.ok(broker.transaction_bucket['read']['dummy'])
      assert.equal(broker.transaction_bucket['read_rank']['dummy'], 0)
      assert.equal(broker.transaction_bucket['read_retry']['dummy'], 0)
      operation.then(
          (result) ->
              assert.fail("Test Transaction always fails!!")
          (error) ->
              assert.ok("dummy" not in broker.transaction_bucket['read'])
              assert.ok("dummy" not in broker.transaction_bucket['read_rank'])
              assert.ok("dummy" not in broker.transaction_bucket['read_retry'])
      )

  it "Broker rank logic test (less than 5)", () ->
      # Test Less than 5 retries
      for i in [1..3]
        operation = broker.execute TestFailingTransaction, "read", "dummy"
      # Based on Transaction rank, we should only retry 3 times
      assert.equal(broker.transaction_bucket['read_rank']['dummy'], 2)
      operation.then(
          (result) ->
              assert.fail("Test Transaction always fails!!")
          (error) ->
              assert.equal(counter, 3)
      )

  it "Broker rank logic test (more than 5)", () ->
      # Test Less than 5 retries
      for i in [1..30]
        operation = broker.execute TestFailingTransaction, "read", "dummy"
      # Based on Transaction rank, we should only retry 3 times
      assert.equal(broker.transaction_bucket['read_rank']['dummy'], 29)
      operation.then(
          (result) ->
              assert.fail("Test Transaction always fails!!")
          (error) ->
              assert.equal(counter, 5)
      )

  it "Broker deferreds unifications test", () ->
      deferreds = []
      for i in [0..9]
          deferreds.push(broker.execute TestFulfillingTransaction, "insert", "dummy2")
      for deferred in deferreds
          deferred.then(
              (result) ->
                  counter +=1
              (failed) ->
                  assert.fail("Test Fulfilling Transaction should always fulfill")
          )
      deferreds[9].done(
          () ->
            assert.equal counter, 10
      )
