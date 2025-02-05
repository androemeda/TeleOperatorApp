// components/PointCloudViewer.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './PointCloudViewer.css'; // Import the custom CSS

export const PointCloudViewer = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Create point cloud
    const geometry = new THREE.BufferGeometry();
    const points = [];
    
    // Generate random points for demo
    for (let i = 0; i < 10000; i++) {
      points.push(
        THREE.MathUtils.randFloatSpread(10),
        THREE.MathUtils.randFloatSpread(10),
        THREE.MathUtils.randFloatSpread(10)
      );
    }
    
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(points, 3)
    );
    
    const material = new THREE.PointsMaterial({
      color: 0x00ff00,
      size: 0.05
    });
    
    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);
    
    // Position camera
    camera.position.z = 15;
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="viewer-container" ref={mountRef}>
      <h2 className="viewer-title">Point Cloud Visualization</h2>
    </div>
  );
};
