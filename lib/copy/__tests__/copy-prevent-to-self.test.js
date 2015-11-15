var assert = require('assert')
var fs = require('fs')
var os = require('os')
var path = require('path')
var copy = require('../copy')
var utimes = require('../../util/utimes')

/* global beforeEach, describe, it */

describe('copy', function () {
  var TEST_DIR

  describe('> copy to self ', function() {
    var SRC_FIXTURES_DIR = path.join(__dirname, '/fixtures')
    var fixtures = path.join(SRC_FIXTURES_DIR, 'sub-directory-fixtures')
    var src = path.join(fixtures, 'src')
    var out = path.join(fixtures, 'src/out')
    var src_out = path.join(fixtures, 'src_out')
    var src_symlink = path.join(fixtures, 'src-symlink')
    var src_a = path.join(fixtures, 'src/a-file')
    var double_src_before_out = path.join(src, src + '_out')
    var double_src_middle_out = path.join(src + '_out', src)

    before(function (cb) {
      rimraf(out, function () {
        fs.mkdirSync(out)
        rimraf(src_out, function (e) {
          fs.mkdirSync(src_out)
          rimraf(double_src_before_out, function () {
            mkdirp.sync(double_src_before_out)
            rimraf(double_src_middle_out, function () {
              mkdirp.sync(double_src_middle_out)
              if (fs.existsSync(src_symlink)) {
                fs.unlink(src_symlink, cb)
              } else {
                cb()
              }
            })
          })
        })
      })
    })

    it('returns an error when user copies the parent to itself', function (cb) {
      copy(src, out, function (err) {
        assert.equal(err.code, 'ESELF')
        cb()
      })
    })

    it('copies `src`  to `src` itself', function (cb) {
      copy(src, src, function (err) {
        assert.equal(err.code, 'ESELF')
        cb()
      })
    })

    it('copies `src` to `src/out` and directory `src/out`  doesn\'t exists ', function (cb) {
      rimraf(out, function () {
        copy(src, out, function (err) {
          assert.equal(err.code, 'ESELF')
          cb()
        })
      })
    })

    it('copies `src` to `src_out` ', function (cb) {
      copy(src, src_out, function (err) {
        assert.ok(!err)
        cb()
      })
    })


    it('copies `src` to `src-symlink`', function (cb) {
      fs.symlinkSync(src, src_symlink)
      copy(src, src_symlink, function (err) {
        assert.equal(err.code, 'ESELF')
        cb()
      })
    })

    it('copies file `src/a-file`  to file `src/a-file` ', function (cb) {
      copy(src_a, src_a, function (err) {
        assert.equal(err.code, 'ESELF')
        cb()
      })
    })

    it('copies directory `src` to `src`/`src`_out', function (cb) {
      copy(src, double_src_before_out, function (err) {
        assert.equal(err.code, 'ESELF')
        cb()
      })
    })

    it('copies directory `src` to `src`_out/`src`', function (cb) {
      copy(src, double_src_middle_out, function (err) {
        assert.ok(!err)
        cb()
      })
    })
  })
})
