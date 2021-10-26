class rigidBody{


    constructor (worldx = 0,worldy = 0,width = 1,height = 1,xSpeed = 0,ySpeed = 0,rotSpeed = 0,friction = 1, colour = "rgba(255,0,0,1)",mass = width*height,angle = 0,bounciness = 0, areachecksize = 40 + Math.sqrt(Math.pow(width/2,2)+ Math.pow(height/2,2)), gravity = 9.81){
        this.worldx = worldx,
        this.worldy = worldy,
        this.width = Math.abs(width),
        this.height = Math.abs(height),
        this.xSpeed = xSpeed,
        this.ySpeed = ySpeed,
        this.rotSpeed = rotSpeed*Math.PI/2,
        this.colour = colour,
        this.mass = Math.abs(mass),
        this.worldAngle = angle*Math.PI*2,
        this.angle1 = Math.atan((height/2)/(width/2)),
        this.angle2 = Math.atan((width/2)/(height/2)) + (Math.PI/2),
        this.angle3 = Math.atan((height/2)/(width/2)) + Math.PI,
        this.angle4 = Math.atan((-width/2)/(-height/2)) + (Math.PI/2*3),
        this.points = [[0,0],[0,0],[0,0],[0,0]],
        this.gravity = gravity,
        this.areachecksize = areachecksize,
        this.friction = friction,
        this.bounciness = bounciness;
        // energy();

    }
    // energy(){
    //     let v = Math.sqrt(Math.pow(this.xSpeed,2) + Math.pow(this.ySpeed,2));
    //     let m = this.mass;
    //     let r = (this.width/2 + this.height/2)/2;
    //     let L = m*v*r;
    //     let w = this.rotSpeed/framesPerSecond;
    //     let I = L/w;
    //     let Ekr = 0.5*I*Math.pow(w,2);
    //     let Ekl = 0.5*m*Math.pow(w,2);
    //     //
    //     let a = cV/cT;
    //     let f = m*a;
    //     let t = f*r;
    //     let ar = t/I;
    //     let w = ar*(1/framesPerSecond);
    // }

    physics(){
        this.oldWorldx = this.worldx;
        this.oldWorldy = this.worldy;
        this.worldAngle += this.rotSpeed/framesPerSecond;
        this.worldx += this.xSpeed/framesPerSecond;
        this.worldy += this.ySpeed/framesPerSecond;
        this.ySpeed += this.gravity/framesPerSecond;
        while(this.worldAngle > Math.PI*2){
            this.worldAngle -= Math.PI*2;
        }
        while(this.worldAngle <= 0){
            this.worldAngle += Math.PI*2;
        }
        let allpoints = [];
        for(let i = 1; i <= 4;i++){
            let pos = rotate(this.worldx,this.worldy,this.width,this.height,eval("this.angle" + i) + this.worldAngle)
            allpoints.push(pos);
        }
        this.collision(this.points, allpoints);
        this.points = allpoints;
    }
    
    draw(){
        drawSquare(X(this.points[0][0]),Y(this.points[0][1]),X(this.points[1][0]),Y(this.points[1][1]),X(this.points[2][0]),Y(this.points[2][1]),X(this.points[3][0]),Y(this.points[3][1]));
    }
    
    linebounceinteraction(i,pointsA,line1x1,line1y1,line1x2,line1y2,line2x1,line2y1,line2x2,line2y2){
        if (collisionsbetweenline(line1x1,line1y1,line1x2,line1y2,line2x1,line2y1,line2x2,line2y2) && collisionsbetweenline(line2x1,line2y1,line2x2,line2y2,line1x1,line1y1,line1x2,line1y2)){
            let gradient1 = gradientssmooth(line1x1,line1y1,line1x2,line1y2);
            let yintersect1 = returnYIntercept(line1x1,line1y1,gradient1);
        //line2
            let gradient2 = gradientssmooth(line2x1,line2y1,line2x2,line2y2);
            let yintersect2 = returnYIntercept(line2x1,line2y1,gradient2);

            let cycle2,cycle3;
            if (i == 0){
                cycle2 = 3;
                cycle3 = 1;
                
            }else if (i == 3){
                cycle2 = -1;
                cycle3 = -3;
            }else{
                cycle2 = -1;
                cycle3 = 1;
            }
            let pointAfter = pointsA[i+cycle3]; 
            let pointBefore = pointsA[i+cycle2];
            let pointNow = pointsA[i];
            let lengthPointAfter = returnDistanceBetweenIntercepts(pointAfter,Math.tan(Math.atan(-1/boxGrad,boxGrad)),boxYIntercept);
            let lengthPointBefore = returnDistanceBetweenIntercepts(pointBefore,Math.tan(Math.atan(-1/boxGrad)),boxGrad,boxYIntercept);
            // let lengthPointAfter = Math.sqrt(Math.pow(pointAfter[0]-returnX2(similtaniouseY(returnYIntercept(...pointAfter,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),boxYIntercept,boxGrad),2)+Math.pow(pointAfter[1]-similtaniouseY(returnYIntercept(...pointAfter,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),2));
            // let lengthPointBefore = Math.sqrt(Math.pow(pointBefore[0]-returnX2(similtaniouseY(returnYIntercept(...pointBefore,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),boxYIntercept,boxGrad),2)+Math.pow(pointBefore[1]-similtaniouseY(returnYIntercept(...pointBefore,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),2));
            let radiusT = Math.sqrt(Math.pow(returnX2(similtaniouseY(returnYIntercept(rb.worldx,rb.worldy,Math.tan(Math.atan(-1/boxGrad))),boxYIntercept,Math.tan(Math.atan(-1/boxGrad)),boxGrad),boxYIntercept,boxGrad,Math.tan(Math.atan(-1/boxGrad)),returnYIntercept(rb.worldx,rb.worldy,Math.tan(Math.atan(-1/boxGrad)))) - returnX2(similtaniouseY(returnYIntercept(...pointNow,Math.tan(Math.atan(-1/boxGrad))),boxYIntercept,Math.tan(Math.atan(-1/boxGrad)),boxGrad),boxYIntercept,boxGrad,Math.tan(Math.atan(-1/boxGrad)),returnYIntercept(...pointNow,Math.tan(Math.atan(-1/boxGrad)))),2) + Math.pow(similtaniouseY(returnYIntercept(rb.worldx,rb.worldy,Math.tan(Math.atan(-1/boxGrad))),boxYIntercept,Math.tan(Math.atan(-1/boxGrad)),boxGrad) - similtaniouseY(returnYIntercept(...pointNow,Math.tan(Math.atan(-1/boxGrad))),boxYIntercept,Math.tan(Math.atan(-1/boxGrad)),boxGrad),2))
            // console.log(lengthPointAfter,lengthPointBefore,radiusT);
            let directionMultiplierForRotation = 1;
            if (lengthPointAfter > lengthPointBefore){
                radiusT *= -1;
                directionMultiplierForRotation = -1;
            }
            let _v = trigH(rb.ySpeed,rb.xSpeed);
            // let _L = rb.mass*_v*trigH(rb.width/2,rb.height/2);
            // let _I = _L/rb.rotSpeed;
            
            // let _F = rb.mass;//still need to do

            
            let rotationradius = trigH(Math.tan(Math.atan(rb.width/2,rb.height/2)));//from corner to center of square
            
            let velocitygrad = Math.tan(Math.atan(rb.ySpeed/rb.xSpeed));
            let velocitygradtop = returnDistanceBetweenIntercepts(box.points[ii],velocitygrad,Math.tan(Math.atan(-1/boxGrad)),boxYIntercept);
            let velocitygradbottom = returnDistanceBetweenIntercepts(box.points[ii],velocitygrad,boxGrad,boxYIntercept);
            let localVelocityGrad = Math.tan(Math.atan(velocitygradtop/velocitygradbottom));
            // let ratio = velocitygradtop/(velocitygradbottom + velocitygradtop);//a2 +b2 = c2
            // let velocityPerpendicular = ratio*_v;
            let velocityPerpendicular = returnXorYchange("y",localVelocityGrad,_v);

            let horisontaltoboxvelocity = Math.sqrt(Math.pow(_v,2) - Math.pow(velocityPerpendicular,2))
            let _pDown = rb.mass*velocityPerpendicular;

            let linearEnergyTransferRatio = Math.tan(Math.atan(radiusT/ rotationradius));
            let c_p = _pDown*(1-linearEnergyTransferRatio);
            let rotationMomentumTransfered = _pDown*linearEnergyTransferRatio;

            let _w = rb.rotSpeed;
            let rot_v = rotationradius*_w;
            let _L = rb.mass*rot_v*rotationradius;
            let _I = Math.tan(Math.atan(_L/_w));
            console.log(_w,rot_v,_L,_I)

            _L = _L + (rotationMomentumTransfered*rotationradius * directionMultiplierForRotation)
            _w = Math.tan(Math.atan(_L/_I));
            
            //returnAngleFromGrad(rise,run)



            rot_v = rotationradius*_w;
            let rot_vGrad = -1/((pointNow[1]-rb.worldy)/(pointNow[0] - rb.worldx));//0.5/1  |_\
            let rotVelocitygradRise = returnDistanceBetweenIntercepts(box.points[ii],rot_vGrad,-1/boxGrad,boxYIntercept);
            let rotVelocitygradRun = returnDistanceBetweenIntercepts(box.points[ii],rot_vGrad,boxGrad,boxYIntercept);
            let localVelocityRotationGrad  = rotVelocitygradRise/rotVelocitygradRun
            // c = sqrt( a^2 + b^2 ) a:b = gradient:1   a = b*gradient | c = sqrt(b^2 + (b * gradient)^2)
            // c^2 = 2b2m2
            // sqrt(c^2/m^2)/2 = b
            // a = sqrt(c^2 - b^2)\
            let rotDown_V = returnXorYchange("y",localVelocityRotationGrad,rot_v);
            console.log(rotDown_V,_w,_L,c_p,rotDown_V*rb.mass);
            if(rotDown_V > c_p){

            }
            
            //convert momentums back into velocities 
            _w = _L/_I;




            final.rotSpeed = _w;
            final.xSpeed = returnXorYchange("x",boxGrad,horisontaltoboxvelocity) + returnXorYchange("x",-1/boxGrad,velocityPerpendicular);
            final.ySpeed = -returnXorYchange("y",boxGrad,horisontaltoboxvelocity) - returnXorYchange("y",-1/boxGrad,velocityPerpendicular);
            // console.log(final,returnXorYchange("x",boxGrad,horisontaltoboxvelocity), returnXorYchange("x",boxGrad/-1,velocityPerpendicular))
            console.log(final.xSpeed,final.ySpeed)







        }
    }



    collision(pointsA,pointsB){

//collisionsbetweenline(line1x1,line1y1,line1x2,line1y2,line2x1,line2y1,line2x2,line2y2)
        //y = mx+c;
        //m1x1+c1 = m2x2+c2
        //x1 = (m2x2+c2-c1)
        //x = (y-c)/m;
        let final = this;
        let rb = this;





        boxColliders.forEach(box => {
            // console.log(box.areachecksize + Math.sqrt(Math.pow(this.width/2,2) + Math.pow(this.height/2,2)),   Math.sqrt(Math.pow(this.worldx - box.worldx,2) + Math.pow(this.worldy - box.worldy,2)),Math.pow(this.worldx - box.worldx,2),Math.pow(this.worldy - box.worldY,2) );
            if(box.areachecksize + Math.sqrt(Math.pow(this.width/2,2) + Math.pow(this.height/2,2)) >= Math.sqrt(Math.pow(this.worldx - box.worldx,2) + Math.pow(this.worldy - box.worldy,2))){
                // console.log("running")
                for(let i =0; i < 4;i++){
                    let yIntersect,gradient;
                    gradient = returnGradient(pointsA[i][0],pointsA[i][1],pointsB[i][0],pointsB[i][1]);
                    yIntersect = returnYIntercept(pointsA[i][0],pointsA[i][1],gradient);
                    
                    for(let ii =0; ii < 4;ii++){//y-mx+c
                        let boxGrad,boxYIntercept,cycle1;
                        if (ii == 3){
                            cycle1 = -3;
                        }else{
                            cycle1 = 1;
                        }
                        boxGrad = returnGradient(box.points[ii][0],box.points[ii][1],box.points[ii+cycle1][0],box.points[ii+cycle1][1]);
                        // [console.log(boxGrad)
                        if (boxGrad !== "vertical" && boxGrad !== "horizontal"){
                            
                            boxYIntercept = returnYIntercept(box.points[ii][0],box.points[ii][1],boxGrad);//dont know where
                            // let ypoint = (boxYIntercept*(-gradient/-boxGrad)-yIntersect)/(((-gradient/-boxGrad) - 1));//did a bad similtaniouseY(c1,c2,m1,m2)
                            let ypoint = similtaniouseY(yIntersect,boxYIntercept,gradient,boxGrad);//did a bad
                            if (ypoint >= smallest([pointsA[i][1],pointsB[i][1]]) && ypoint <= biggest([pointsA[i][1],pointsB[i][1]])){//somewhere
                                // console.log(i,ii,ypoint, smallest([pointsA[i][1],pointsB[i][1]]),biggest([pointsA[i][1],pointsB[i][1]]))
                                
                                let cycle2,cycle3;
                                if (i == 0){
                                    cycle2 = 3;
                                    cycle3 = 1;
                                    
                                }else if (i == 3){
                                    cycle2 = -1;
                                    cycle3 = -3;
                                }else{
                                    cycle2 = -1;
                                    cycle3 = 1;
                                }
                                let pointAfter = pointsA[i+cycle3]; 
                                let pointBefore = pointsA[i+cycle2];
                                let pointNow = pointsA[i];
                                let lengthPointAfter = returnDistanceBetweenIntercepts(pointAfter,-1/boxGrad,boxGrad,boxYIntercept);
                                let lengthPointBefore = returnDistanceBetweenIntercepts(pointBefore,-1/boxGrad,boxGrad,boxYIntercept);
                                // let lengthPointAfter = Math.sqrt(Math.pow(pointAfter[0]-returnX2(similtaniouseY(returnYIntercept(...pointAfter,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),boxYIntercept,boxGrad),2)+Math.pow(pointAfter[1]-similtaniouseY(returnYIntercept(...pointAfter,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),2));
                                // let lengthPointBefore = Math.sqrt(Math.pow(pointBefore[0]-returnX2(similtaniouseY(returnYIntercept(...pointBefore,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),boxYIntercept,boxGrad),2)+Math.pow(pointBefore[1]-similtaniouseY(returnYIntercept(...pointBefore,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),2));
                                let radiusT = Math.sqrt(Math.pow(returnX2(similtaniouseY(returnYIntercept(rb.worldx,rb.worldy,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),boxYIntercept,boxGrad) - returnX2(similtaniouseY(returnYIntercept(...pointNow,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),boxYIntercept,boxGrad),2) + Math.pow(similtaniouseY(returnYIntercept(rb.worldx,rb.worldy,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad) - similtaniouseY(returnYIntercept(...pointNow,-1/boxGrad),boxYIntercept,-1/boxGrad,boxGrad),2))
                                // console.log(lengthPointAfter,lengthPointBefore,radiusT);
                                let directionMultiplierForRotation = 1;
                                if (lengthPointAfter > lengthPointBefore){
                                    radiusT *= -1;
                                    directionMultiplierForRotation = -1;
                                }
                                let _v = trigH(rb.ySpeed,rb.xSpeed);
                                // let _L = rb.mass*_v*trigH(rb.width/2,rb.height/2);
                                // let _I = _L/rb.rotSpeed;
                                
                                // let _F = rb.mass;//still need to do
        
                                
                                let rotationradius = trigH(rb.width/2,rb.height/2);//from corner to center of square
                                
                                let velocitygrad = (rb.ySpeed/rb.xSpeed);
                                let velocitygradtop = returnDistanceBetweenIntercepts(box.points[ii],velocitygrad,-1/boxGrad,boxYIntercept);
                                let velocitygradbottom = returnDistanceBetweenIntercepts(box.points[ii],velocitygrad,boxGrad,boxYIntercept);
                                let localVelocityGrad = velocitygradtop/velocitygradbottom;
                                // let ratio = velocitygradtop/(velocitygradbottom + velocitygradtop);//a2 +b2 = c2
                                // let velocityPerpendicular = ratio*_v;
                                let velocityPerpendicular = returnXorYchange("y",localVelocityGrad,_v);

                                let horisontaltoboxvelocity = Math.sqrt(Math.pow(_v,2) - Math.pow(velocityPerpendicular,2))
                                let _pDown = rb.mass*velocityPerpendicular;

                                let linearEnergyTransferRatio = radiusT/ rotationradius;
                                let c_p = _pDown*(1-linearEnergyTransferRatio);
                                let rotationMomentumTransfered = _pDown*linearEnergyTransferRatio;

                                let _w = rb.rotSpeed;
                                let rot_v = rotationradius*_w;
                                let _L = rb.mass*rot_v*rotationradius;
                                let _I = _L/_w;
                                console.log(_w,rot_v,_L,_I)

                                _L = _L + (rotationMomentumTransfered*rotationradius * directionMultiplierForRotation)
                                _w = _L/_I;
                                
                                



                                rot_v = rotationradius*_w;
                                let rot_vGrad = -1/((pointNow[1]-rb.worldy)/(pointNow[0] - rb.worldx));//0.5/1  |_\
                                let rotVelocitygradRise = returnDistanceBetweenIntercepts(box.points[ii],rot_vGrad,-1/boxGrad,boxYIntercept);
                                let rotVelocitygradRun = returnDistanceBetweenIntercepts(box.points[ii],rot_vGrad,boxGrad,boxYIntercept);
                                let localVelocityRotationGrad  = rotVelocitygradRise/rotVelocitygradRun
                                // c = sqrt( a^2 + b^2 ) a:b = gradient:1   a = b*gradient | c = sqrt(b^2 + (b * gradient)^2)
                                // c^2 = 2b2m2
                                // sqrt(c^2/m^2)/2 = b
                                // a = sqrt(c^2 - b^2)\
                                let rotDown_V = returnXorYchange("y",localVelocityRotationGrad,rot_v);
                                console.log(rotDown_V,_w,_L,c_p,rotDown_V*rb.mass);
                                if(rotDown_V > c_p){

                                }
                                
                                //convert momentums back into velocities 
                                _w = _L/_I;




                                final.rotSpeed = _w;
                                final.xSpeed = returnXorYchange("x",boxGrad,horisontaltoboxvelocity) + returnXorYchange("x",-1/boxGrad,velocityPerpendicular);
                                final.ySpeed = -returnXorYchange("y",boxGrad,horisontaltoboxvelocity) - returnXorYchange("y",-1/boxGrad,velocityPerpendicular);
                                // console.log(final,returnXorYchange("x",boxGrad,horisontaltoboxvelocity), returnXorYchange("x",boxGrad/-1,velocityPerpendicular))
                                console.log(final.xSpeed,final.ySpeed)





                                






                                // console.log("running");
                                // let oldSpeedGrad = returnGradient(this.oldWorldx,this.oldWorldy,this.worldx,this.worldy);
                                // let speed = Math.sqrt(Math.pow(this.xSpeed,2) + Math.pow(this.ySpeed,2));
                                // let newSpeedGrad = oldSpeedGrad - boxGrad;
                                // let horizontalspeed = speed*(1 /(newSpeedGrad+1));
                                // let verticalspeed = speed*(newSpeedGrad/(newSpeedGrad+1));

                                // let cornergrad = returnGradient(this.oldWorldx,this.oldWorldy,pointsA[i][0],pointsA[i][1]) - oldSpeedGrad;
                                // let rotspeedgrad = 1/cornergrad; // rise / run; rotspeedgrad/1;
                                // let rise = this.rotSpeed*(rotspeedgrad/(rotspeedgrad+1));
                                // console.log(rise,cornergrad,rotspeedgrad);
                                // if(rise < 0){
                                //     console.log("bounce")
                                // }else{
                                //     console.log("nobounce")

                                // }

                                // let v = Math.sqrt(Math.pow(this.xSpeed,2) + Math.pow(this.ySpeed,2));
                                // let m = this.mass;
                                // let r = (this.width/2 + this.height/2)/2;
                                // let L = m*v*r;
                                // let w = this.rotSpeed/framesPerSecond;
                                // let I = L/w;
                                // let Ekr = 0.5*I*Math.pow(w,2);
                                // let Ekl = 0.5*m*Math.pow(w,2);
                                //     //
                                // let a = cV/cT;
                                // let f = m*a;
                                // let t = f*r;
                                // let ar = t/I;
                                // let w = ar*(1/framesPerSecond);
                            
                            }
                        }
                    }
                }
            }
            // if (biggest([pointsB[0][0],pointsB[1][0],pointsB[2][0],pointsB[3][0]]) >= smallest([box.points[0][0],box.points[1][0],box.points[2][0],box.points[3][0]]) && smallest([pointsB[0][0],pointsB[1][0],pointsB[2][0],pointsB[3][0]]) <= biggest([box.points[0][0],box.points[1][0],box.points[2][0],box.points[3][0]]) ){

            // }
            // let rad = Math.sqrt(Math.pow(box.width/2,2) + Math.pow(box.height,2));
            // if(this.nearCheck(box.points,this.points)){//swap the checksize with the obkects

            // }
        });
        blocks[0] = final;

        //y - mx = c;
        // function circlehitboxdetect(xposC, yposC, radiusC, xpoint, ypoint) {
        //     if (xpoint >= xposC - radiusC && xpoint <= xposC + radiusC && ypoint >= yposC - radiusC && ypoint <= yposC + radiusC) {
        //       let Yintercept1 = Math.sqrt(Math.abs(Math.pow(radiusC, 2) - Math.pow(ypoint - yposC, 2))) + xposC;
        //       let Yintercept2 = (-Math.sqrt(Math.abs(Math.pow(radiusC, 2) - Math.pow(ypoint - yposC, 2)))) + xposC;
        //       if (xpoint >= Yintercept2 && xpoint <= Yintercept1) {
        //         return true;
        //       } else {
        //         return false;
        //       }
        //     } else {
        //       return false;
        //     }
        //   }
        
        //find line intercept between checked lines
    }

}