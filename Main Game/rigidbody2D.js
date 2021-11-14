class rigidBody {


  constructor(worldx = 0, worldy = 0, width = 1, height = 1, xSpeed = 0, ySpeed = 0, rotSpeed = 0, camera = false, friction = 0.7, colour = "rgba(255,0,0,1)", mass = width * height, angle = 0, bounciness = 0.9, gravity = 9.81, checks = 10, borderwidth = 0) {
    this.worldx = worldx,
      this.worldy = worldy,
      this.width = Math.abs(width),
      this.height = Math.abs(height),
      this.xSpeed = xSpeed,
      this.ySpeed = ySpeed,
      this.rotSpeed = rotSpeed * Math.PI / 2,
      this.colour = colour,
      this.mass = Math.abs(mass),
      this.worldAngle = angle * Math.PI * 2,
      this.angle1 = Math.atan((height / 2) / (width / 2)),
      this.angle2 = Math.atan((width / 2) / (height / 2)) + (Math.PI / 2),
      this.angle3 = Math.atan((height / 2) / (width / 2)) + Math.PI,
      this.angle4 = Math.atan((-width / 2) / (-height / 2)) + (Math.PI / 2 * 3),
      this.points = [];
    this.camera = camera;
    for (let i = 1; i <= 4; i++) {
      let pos = rotate(this.worldx, this.worldy, this.width, this.height, eval("this.angle" + i) + this.worldAngle);
      this.points.push(pos);
    }
    this.gravity = gravity,
      this.friction = friction,
      this.bounciness = bounciness;
    this.checks = checks;
    this.borderwidth = borderwidth;
  }

  physics() {
    let maxloops = this.checks;
    let check = [];
    let testthis = JSON.parse(JSON.stringify(this));
    testthis.oldWorldx = testthis.worldx;
    testthis.oldWorldy = testthis.worldy;
    testthis.worldAngle += testthis.rotSpeed / framesPerSecond;
    testthis.worldx += testthis.xSpeed / framesPerSecond;
    testthis.worldy += testthis.ySpeed / framesPerSecond;
    testthis.ySpeed += testthis.gravity / framesPerSecond;
    testthis.xSpeed += playermovespeed / framesPerSecond * horisontal;
    let temp = this.speedlimit(testthis.xSpeed, testthis.ySpeed);
    if (temp !== false) {
      testthis.ySpeed = temp.ySpeed;
      testthis.xSpeed = temp.xSpeed;
    }
    while (testthis.worldAngle > Math.PI * 2) {
      testthis.worldAngle -= Math.PI * 2;
    }
    while (testthis.worldAngle <= 0) {
      testthis.worldAngle += Math.PI * 2;
    }
    let allpoints = [];
    for (let i = 1; i <= 4; i++) {
      let pos = rotate(testthis.worldx, testthis.worldy, testthis.width, testthis.height, eval("testthis.angle" + i) + testthis.worldAngle)
      allpoints.push(pos);
    }
    check = this.collision(testthis.points, allpoints, testthis);
    if (check == false) {
      return;
    }
    let counter = 0;
    testthis = JSON.parse(JSON.stringify(this));
    // console.log("nowhile: ",check[3])
    while (check[3] == true && counter <= maxloops) {
      if (counter >= 1) {

        testthis.xSpeed = check[0];
        testthis.ySpeed = check[1];
        testthis.rotSpeed = check[2];
      }
      counter++;
      testthis.oldWorldx = testthis.worldx;
      testthis.oldWorldy = testthis.worldy;
      testthis.worldAngle += testthis.rotSpeed / framesPerSecond;
      testthis.worldx += testthis.xSpeed / framesPerSecond;
      testthis.worldy += testthis.ySpeed / framesPerSecond;
      testthis.ySpeed += testthis.gravity / framesPerSecond;
      testthis.xSpeed += playermovespeed / framesPerSecond * horisontal;
      let temp = this.speedlimit(testthis.xSpeed, testthis.ySpeed);
      if (temp !== false) {
        testthis.ySpeed = temp.ySpeed;
        testthis.xSpeed = temp.xSpeed;
      }
      while (testthis.worldAngle > Math.PI * 2) {
        testthis.worldAngle -= Math.PI * 2;
      }
      while (testthis.worldAngle <= 0) {
        testthis.worldAngle += Math.PI * 2;
      }
      let allpoints = [];
      for (let i = 1; i <= 4; i++) {
        let pos = rotate(testthis.worldx, testthis.worldy, testthis.width, testthis.height, eval("testthis.angle" + i) + testthis.worldAngle)
        allpoints.push(pos);
      }
      check = this.collision(testthis.points, allpoints, testthis);
      if (check == false) {
        return;
      }
      // console.log("while: ",check[3])

    }
    if (counter >= maxloops) {
      check = this.collision(testthis.points, allpoints, testthis, true);
      if (check == false) {
        return;
      }
      // console.log("hi")
      this.xSpeed = check[0];
      this.ySpeed = check[1];
      this.rotSpeed = check[2];

      this.oldWorldx = this.worldx;
      this.oldWorldy = this.worldy;
      // this.worldAngle += this.rotSpeed/framesPerSecond;
      this.worldx += this.xSpeed / framesPerSecond;
      this.worldy += this.ySpeed / framesPerSecond;
      this.xSpeed += playermovespeed / framesPerSecond * horisontal;
      let temp = this.speedlimit(this.xSpeed, this.ySpeed);
      if (temp !== false) {
        this.ySpeed = temp.ySpeed;
        this.xSpeed = temp.xSpeed;
      }
      // this.ySpeed += this.gravity/framesPerSecond;
      while (this.worldAngle > Math.PI * 2) {
        this.worldAngle -= Math.PI * 2;
      }
      while (this.worldAngle <= 0) {
        this.worldAngle += Math.PI * 2;
      }
      let allpoints2 = [];
      for (let i = 1; i <= 4; i++) {
        let pos = rotate(this.worldx, this.worldy, this.width, this.height, eval("this.angle" + i) + this.worldAngle)
        allpoints2.push(pos);
      }
      this.points = allpoints2;
    } else {
      if (counter >= 1) {
        this.xSpeed = check[0];
        this.ySpeed = check[1];
        this.rotSpeed = check[2];
      }

      this.oldWorldx = this.worldx;
      this.oldWorldy = this.worldy;
      this.worldAngle += this.rotSpeed / framesPerSecond;
      this.worldx += this.xSpeed / framesPerSecond;
      this.worldy += this.ySpeed / framesPerSecond;
      this.ySpeed += this.gravity / framesPerSecond;
      this.xSpeed += playermovespeed / framesPerSecond * horisontal;
      let temp = this.speedlimit(this.xSpeed, this.ySpeed);
      if (temp !== false) {
        this.ySpeed = temp.ySpeed;
        this.xSpeed = temp.xSpeed;
      }
      while (this.worldAngle > Math.PI * 2) {
        this.worldAngle -= Math.PI * 2;
      }
      while (this.worldAngle <= 0) {
        this.worldAngle += Math.PI * 2;
      }
      let allpoints2 = [];
      for (let i = 1; i <= 4; i++) {
        let pos = rotate(this.worldx, this.worldy, this.width, this.height, eval("this.angle" + i) + this.worldAngle)
        allpoints2.push(pos);
      }
      this.points = allpoints2;

    }
    if (this.camera) {
      cameraOffset.x = -this.worldx;
      cameraOffset.y = -this.worldy;
    }
  }
  speedlimit(_xSpeed, _ySpeed) {
    if (Math.abs(_xSpeed) >= 10) {
      return { xSpeed: (_xSpeed - (Math.abs(_xSpeed) - 10) * (_xSpeed / Math.abs(_xSpeed))), ySpeed: _ySpeed };
    }
    return false;
  }
  draw() {
    drawSquare(...this.points[0], ...this.points[1], ...this.points[2], ...this.points[3],this.colour,this.borderwidth);
  }
  linebounceinteraction(i, pointsA, line1x1, line1y1, line1x2, line1y2, line2x1, line2y1, line2x2, line2y2, rba, tag, ii) {
    let minPspeed = 2;
    let rb = JSON.parse(JSON.stringify(rba));
    if (collisionsbetweenline(line1x1, line1y1, line1x2, line1y2, line2x1, line2y1, line2x2, line2y2, ii)) {
      //   console.log(ii);
      let anglelline = returnAngleFromGrad(line2y2 - line2y1, line2x2 - line2x1);
      let pointNow = pointsA[i];
      let anglecheck = returnAngleFromGrad(rb.worldy - pointNow[1], rb.worldx - pointNow[0]);
      anglecheck -= anglelline;
      if (anglecheck < 0) {
        anglecheck += 2 * Math.PI;
      } else if (anglecheck > 2 * Math.PI) {
        anglecheck -= 2 * Math.PI;
      }
      let directionMultiplierForRotation = -1;
      if (anglecheck > Math.PI / 2 && anglecheck < Math.PI || anglecheck > Math.PI / 2 * 3 && anglecheck > Math.PI) {
        directionMultiplierForRotation = 1;
      }
      let _v = trigH(rb.ySpeed, rb.xSpeed);
      let rotationradius = trigH(rb.width / 2, rb.height / 2); //from corner to center of square
      let anglevelocity = returnAngleFromGrad(rb.ySpeed, rb.xSpeed);
      if (anglevelocity < 0) {
        anglevelocity += 2 * Math.PI;
      } else if (anglevelocity > 2 * Math.PI) {
        anglevelocity -= 2 * Math.PI;
      }
      let tempanglevelocity = anglevelocity - anglelline;
      if (tempanglevelocity < 0) {
        tempanglevelocity += 2 * Math.PI;
      } else if (tempanglevelocity > 2 * Math.PI) {
        tempanglevelocity -= 2 * Math.PI;
      }
      let velocityPerpendicular = Math.sin(tempanglevelocity) * _v;
      if (Math.abs(velocityPerpendicular) < minPspeed) {
        velocityPerpendicular = minPspeed * (velocityPerpendicular / Math.abs(velocityPerpendicular));
      }
      let horisontaltoboxvelocity = Math.cos(tempanglevelocity) * _v;
      let _pDown = rb.mass * velocityPerpendicular;

      let linearEnergyTransferRatio = Math.abs(Math.sin(anglecheck));
      let rotationMomentumTransfered = Math.abs(_pDown * (1 - linearEnergyTransferRatio));
      let c_p = _pDown * (linearEnergyTransferRatio);

      let _w = rb.rotSpeed;
      let rot_v = rotationradius * _w;
      let _L = rb.mass * rot_v * rotationradius;
      let _I = rb.mass * Math.pow(rotationradius, 2);
      if (_L > 0 && _L > _L + (rotationradius * rotationMomentumTransfered * directionMultiplierForRotation)) {
        if (c_p > 0) {
          c_p += Math.abs(1 - linearEnergyTransferRatio) * Math.abs(_L) / rotationradius;
        } else {
          c_p -= Math.abs(1 - linearEnergyTransferRatio) * Math.abs(_L) / rotationradius;
        }
        _L = (_L * -1) + (rotationradius * rotationMomentumTransfered * directionMultiplierForRotation) + (Math.abs(1 - linearEnergyTransferRatio) * Math.abs(_L));
      } else if (_L < 0 && _L < _L + (rotationradius * rotationMomentumTransfered * directionMultiplierForRotation / 2)) {
        if (c_p > 0) {
          c_p += Math.abs(1 - linearEnergyTransferRatio) * Math.abs(_L) / rotationradius;
        } else {
          c_p -= Math.abs(1 - linearEnergyTransferRatio) * Math.abs(_L) / rotationradius;
        }
        _L = (_L * -1) + (rotationradius * rotationMomentumTransfered * directionMultiplierForRotation) - (Math.abs(1 - linearEnergyTransferRatio) * Math.abs(_L));
      } else {
        _L = _L + (rotationradius * rotationMomentumTransfered * directionMultiplierForRotation);
      }
      _w = Math.tan(Math.atan(_L / _I));
      rot_v = rotationradius * _w;
      velocityPerpendicular += ((velocityPerpendicular * -1) / Math.abs(velocityPerpendicular)) * (Math.abs(c_p / rb.mass) + Math.abs(velocityPerpendicular));
      if (tag == "ground" && vertical == 1 && Math.abs(rb.ySpeed) <= maxverticalspeed) {
        velocityPerpendicular += playerJumpSpeed * (velocityPerpendicular / Math.abs(velocityPerpendicular));
      }
      if (Math.abs(velocityPerpendicular) < minPspeed) {
        velocityPerpendicular = minPspeed * (velocityPerpendicular / Math.abs(velocityPerpendicular));
      }
      var newtotalV = trigH(velocityPerpendicular, horisontaltoboxvelocity)
      var newvelocityangle = returnAngleFromGrad(velocityPerpendicular, horisontaltoboxvelocity) + anglelline;
      if (newvelocityangle < 0) {
        newvelocityangle += 2 * Math.PI;
      } else if (newvelocityangle > 2 * Math.PI) {
        newvelocityangle -= 2 * Math.PI;
      }
      if (Math.abs(_w) > maxrotspeed) {
        _w = maxrotspeed * (_w / Math.abs(_w));
      }
      rb.rotSpeed = _w * rb.bounciness;
      rb.ySpeed = Math.sin(newvelocityangle) * newtotalV * rb.bounciness;
      rb.xSpeed = Math.cos(newvelocityangle) * newtotalV * rb.friction;
      return rb;
    } else {
      return rb;
    }
  } //func end

  collision(pointsA, pointsB, rba) {
    let newstats = rba;
    let hit = false;
    if (this.camera) {

      for (let i = 0; i < 4; i++) {
        for (let ii = 0; ii < level.length; ii++) {
          let newnew = this.linebounceinteraction(i, pointsA, pointsA[i][0], pointsA[i][1], pointsB[i][0], pointsB[i][1], ...level[ii][0], ...level[ii][1], rba, level[ii][2]);
          if (newnew.rotSpeed !== rba.rotSpeed || newnew.xSpeed !== rba.xSpeed || newnew.ySpeed !== rba.ySpeed) {
            hit = true;
            newstats = newnew;
          }
        }
        for (let ii = 0; ii < respawnlines.length; ii++) {
          if (collisionsbetweenline(pointsA[i][0], pointsA[i][1], pointsB[i][0], pointsB[i][1], ...respawnlines[ii][0], ...respawnlines[ii][1])) {
            // console.log("yes")
            if (respawnlines[ii][2] == "respawn") {
              respawn();
              return false; //here 
            } else if (respawnlines[ii][2] == "checkpoint") {
              currentcheckpoint = respawnlines[ii][3];
            }
          }
        }
      }
      for (let i = 0; i < 4; i++) {
        for (let ii = 0; ii < specialLines.length; ii++) {
          if (collisionsbetweenline(pointsA[i][0], pointsA[i][1], pointsB[i][0], pointsB[i][1], ...specialLines[ii][0], ...specialLines[ii][1])) {
            // console.log("yes")
            if (specialLines[ii][2] == "float") {
              this.gravity = specialLines[ii][3]
            } else if (specialLines[ii][2] == "nofloat") {
              this.gravity = specialLines[ii][3]
            } else if (specialLines[ii][2] == "finish" && gamestate == "playing") {
              finish();
            }
          }
        }
      }
    } else {
      let line = [
        [
          [aX(0), aY(0)],
          [aX(canvas.width), aY(0)]
        ],
        [
          [aX(canvas.width), aY(0)],
          [aX(canvas.width), aY(canvas.height)],
        ],
        [
          [aX(canvas.width), aY(canvas.height)],
          [aX(0), aY(canvas.height)],
        ],
        [
          [aX(0), aY(canvas.height)],
          [aX(0), aY(0)]
        ]
      ]
    //   console.log(line[0])
      for (let i = 0; i < 4; i++) {
        for (let ii = 0; ii < line.length; ii++) {
          let newnew = this.linebounceinteraction(i, pointsA, pointsA[i][0], pointsA[i][1], pointsB[i][0], pointsB[i][1], ...line[ii][0], ...line[ii][1], rba);
          if (newnew.rotSpeed !== rba.rotSpeed || newnew.xSpeed !== rba.xSpeed || newnew.ySpeed !== rba.ySpeed) {
            hit = true;
            newstats = newnew;
          }
        }
      }
    }
    return [newstats.xSpeed, newstats.ySpeed, newstats.rotSpeed, hit];
  }
} //specialLines