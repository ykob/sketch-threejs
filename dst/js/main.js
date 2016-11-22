(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var canvas = document.getElementById('canvas-webgl');
var renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas
});
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
var clock = new THREE.Clock();
var stats = new Stats();

var resizeWindow = function resizeWindow() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
var setEvent = function setEvent() {
  window.addEventListener('resize', function () {
    resizeWindow();
  });
};
var initDatGui = function initDatGui() {
  var gui = new dat.GUI();
  // const controller = {
  //   radius: gui.add(sphere, 'radius', 0, 1000).name('Sphere Radius')
  // }
  // controller.radius.onChange((value) => {
  //   sphere.mesh.material.uniforms.radius.value = value;
  // });
};
var initStats = function initStats() {
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
};
var render = function render() {
  // sphere.render(clock.getDelta());
  renderer.render(scene, camera);
};
var renderLoop = function renderLoop() {
  stats.begin();
  render();
  stats.end();
  requestAnimationFrame(renderLoop);
};

var init = function init() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xeeeeee, 1.0);
  camera.position.set(1000, 1000, 1000);
  camera.lookAt(new THREE.Vector3());

  setEvent();
  initDatGui();
  initStats();
  resizeWindow();
  renderLoop();
};
init();

},{}]},{},[1]);
