var assert = require('assert')
var fs = require('fs')
var os = require('os')
var path = require('path')
var copySync = require('../copy-sync')

/* global beforeEach, describe, it */

describe('copy', function () {
  describe('> copy to self ', function () {
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

    it('returns an error when user copies the parent to itself', function () {
      try {
        copySync(src, out)
      } catch (e) {
        assert.equal(err.code, 'ESELF')
      }
    })

    it('copies `src`  to `src` itself', function () {
      try {
        copySync(src, src)
      } catch (e) {
        assert.equal(err.code, 'ESELF')
      }
    })

    it('copies `src` to `src/out` and directory `src/out`  doesn\'t exists ', function (cb) {
      rimraf(out, function () {
        try {
          copySync(src, out)
        } catch (e) {
          assert.equal(err.code, 'ESELF')
          cb()
        }
      })
    })

    it('copies `src` to `src_out` ', function () {
      copySync(src, src_out)
    })


    it('copies `src` to `src-symlink`', function () {
      fs.symlinkSync(src, src_symlink)
      try {
        copySync(src, src_symlink)
      } catch (e) {
        assert.equal(err.code, 'ESELF')
      }
    })

    it('copies file `src/a-file`  to file `src/a-file` ', function () {
      try {
        copySync(src_a, src_a)
      } catch (e) {
        assert.equal(err.code, 'ESELF')
      }
    })

    it('copies directory `src` to `src`/`src`_out', function () {
      try {
        copySync(src, double_src_before_out)
      } catch (e) {
        assert.equal(err.code, 'ESELF')
      }
    })

    it('copies directory `src` to `src`_out/`src`', function () {
      copySync(src, double_src_middle_out)
    })
  })
})
