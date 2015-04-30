# Three.js 学習メモ

主に「[HTML5による物理シミュレーション 著：遠藤 理平](http://goo.gl/krKKTV)」の覚書です。

## Three.jsの基礎（軸オブジェクトの描画）

Three.jsでは*レンダラーオブジェクト*と*シーンオブジェクト*を生成して利用する。

THREE.WebGLRenderer()  
http://threejs.org/docs/#Reference/Renderers/WebGLRenderer

THREE.Scene()  
http://threejs.org/docs/#Reference/Scenes/Scene

### Three.jsにおける「レンダラー」

仮想的な3次元空間における物体を、2次元平面のディスプレイに適切に描画するための流れを指す。  
実際に描画することを*レンダリング*と呼ぶ。

### 2種類のカメラ

コンピュータ上の仮想の3次元空間からどのように2次元平面に射影するかを指定するのが*カメラ*。  
Three.jsでは*透視投影*と*正投影*の2つの方法でカメラを設定することができる。

#### [透視投影](http://ja.wikipedia.org/wiki/%E9%80%8F%E8%A6%96%E6%8A%95%E5%BD%B1)

視点から手前の物体を大きく、遠くの物体を小さく描画し、遠近感を生み出す方式。  
これは通常生活における物の見え方と同じ。

THREE.PerspectiveCamera()  
http://threejs.org/docs/#Reference/Cameras/PerspectiveCamera

#### [正投影](http://ja.wikipedia.org/wiki/%E6%AD%A3%E6%8A%95%E5%BD%B1%E5%9B%B3)

物体の見た目の大きさを、視点からの距離によらず描画する方式。

THREE.OrthographicCamera()  
http://threejs.org/docs/#Reference/Cameras/OrthographicCamera

---

THREE.AxisHelper()
http://threejs.org/docs/#Reference/Extras.Helpers/AxisHelper
