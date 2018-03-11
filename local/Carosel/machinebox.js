function machineBox() {
    initMachineGB();
    initMachineIB();
    jQuery(window).off('resize', machineResizeW);
    jQuery(window).on('resize', machineResizeW);
}

function initMachineGB() {
    var gls = jQuery('.machineGalleryBox');

    gls.each(function(ind){
        var gl = jQuery(this).attr('gId', ind),
            imgs = gl.find('img').attr('gId', ind);
        
        if(imgs.length == 0){
            return 1;
        }

        imgs.filter('.machineImgBox').removeClass('machineImgBox');
        imgs.each(function(ind){
            var $img = jQuery( this );
            var img = jQuery(this).attr('mpId', ind - 1).attr('mId', ind).attr('mnId', ind + 1);

            if( !$img.attr( 'hd' ) )
                $img.attr( 'hd', $img.attr( 'src' ) );
        });
        jQuery(imgs[0]).attr('mpId', '');
        jQuery(imgs[imgs.length-1]).attr('mnId', '');

        imgs.off('click', machineOpenI);
        imgs.on('click', machineOpenI);
    });

    return 1;
}

function initMachineIB() {
    var imgs = jQuery('img.machineImgBox');

    if ( imgs.length == 0 ) {
        return 0;
    }

    imgs.each(function(ind){
        var img = jQuery(this).attr('mpId', ind - 1).attr('mId', ind).attr('mnId', ind + 1);
        if( !jQuery( this ).attr( 'hd' ) )
            jQuery( this ).attr( 'hd', jQuery( this ).attr( 'src' ) );
    });

    jQuery(imgs[0]).attr('mpId', '');
    jQuery(imgs[imgs.length-1]).attr('mnId', '');

    imgs.off('click', machineOpenI);
    imgs.on('click', machineOpenI);

    return 1;
}

function machineLoadI( data ) {
    var box = jQuery('#machineBox'),
        imgHD = box.find('img'),
        btns = box.find('#machineNextImg, #machinePreviosImg');

    imgHD.attr('src', data.srcHd).on('load', function(){
        var img = jQuery(this),
            mW = this.width,
            mH = this.height;

        machineStatusLoadOff();
        img.attr('mnId', data.mnId).attr('mpId', data.mpId).attr('gId', data.gId).attr('mH', mH).attr('mW', mW).parent().removeClass('machineOff').height(mH).width(mW).parent().removeClass('machineOff');
        machineSizeI( img );
    }).on('error', function(){
        machineCloseB();
        machineStatusLoadOff();
    });

    btns.removeClass('machineOff');
    if( data.mnId == ''){
        btns.filter('#machineNextImg').addClass('machineOff');
    }
    if( data.mpId == '' ){
        btns.filter('#machinePreviosImg').addClass('machineOff');
    }
}


function machineOpenI( event ) {
    event.preventDefault();
    event.stopPropagation();

    machineCloseB();
    var img = jQuery(this),
        box = machineCreateB().addClass('machineOff');

    machineStatusLoadOn(img);

    machineLoadI({
        srcHd : img.attr('hd'),
        gId : (img.attr('gId')? img.attr('gId') : false),
        mnId : img.attr('mnId'),
        mpId : img.attr('mpId')
    });
}

function machineLeafI( event ){
    event.preventDefault();
    event.stopPropagation();


    var but = jQuery(this),
        to = but.filter('#machineNextImg').length == 1? 'mnId' : 'mpId',
        img = but.parent().addClass('machineOff').find('img'),
        toImg = img.attr('gId') != 'false'? jQuery('.machineGalleryBox[gId='+img.attr('gId')+'] img[mId='+img.attr(to)+']') : jQuery('.machineImgBox[mId='+img.attr(to)+']');

    machineStatusLoadOn(jQuery('#machineBox #machineDimmer'));

    machineLoadI({
        srcHd : toImg.attr('hd'),
        gId : (toImg.attr('gId')? toImg.attr('gId') : false),
        mnId : toImg.attr('mnId'),
        mpId : toImg.attr('mpId')
    });
}

function machineKeyControl( event ){
    var nextBtn = jQuery('#machineNextImg'),
        prevBtn = jQuery('#machinePreviosImg');

    if( event.which == 39 && nextBtn.css('display') != 'none' ){
        event.preventDefault()
        nextBtn.trigger('click');
    }

    if( event.which == 37 && prevBtn.css('display') != 'none' ){
        event.preventDefault()
        prevBtn.trigger('click');
    }

    if( event.which == 27 ){
        event.preventDefault()
        jQuery('#machineDimmer').trigger('click');
    }

}

function machineSizeI( img = null ) {
    var img = img? img : jQuery('#machineBox img'),
        marginH = 100, marginW = 100,
        imgH = img.attr('mH'), imgW = img.attr('mW'),
        // imgH = img.height(), imgW = img.width(),
        winH = jQuery(window).height(), winW = jQuery(window).width(),
        dH = winH - imgH - marginH, dW = winW - imgW - marginW;

    if ( dH < 0 || dW < 0) {
        newImgH = winH - marginH;
        newImgW = imgW*newImgH/imgH;
        if (winW - newImgW <= 0){
            newImgW = winW - marginW;
            newImgH = imgH*newImgW/imgW;         
        }
    }

    img.parent().height(newImgH).width(newImgW);

    return [newImgW, newImgH];
}

function machineCreateB() {
    var box = '<div id="machineBox"><div id="machineDimmer"></div><div id="machineImgBox" class="machineOff"><div id="machinePreviosImg"><div class="machinePreviosT"></div></div><img src="" mnId="" mpId="" gId=""><div id="machineNextImg"><div class="machineNextT"></div></div><div id="machineCloseBox"><span id="machineCloseX">X</span></div></div><div id="machineImgWait"></div></div>';

    if ( jQuery('#machineBox').length != 0 ) {
        jQuery('#machineBox').remove();
    }

    box = jQuery(box).appendTo('body');
    box.find('#machinePreviosImg, #machineNextImg').on('click', machineLeafI);
    box.find('#machineDimmer, #machineCloseBox').on('click', machineCloseB);

    jQuery(document).on('keydown', machineKeyControl);

    return box;   
}

function machineResizeW() {
    clearTimeout(jQuery(window).attr('machineBoxT'));

    var machineBoxT = setTimeout(machineSizeI, 1000);
}

function machineCloseB( event ) {
    jQuery('#machineBox').remove();
    machineStatusLoadOff();
    jQuery(document).off('keydown', machineKeyControl);
}

function machineStatusLoadOn( node ){
    machineStatusLoadOff();
    var nH = node.height(),
        nW = node.width();

    node.wrap('<div id="machineWrap"></div>')
        .parent().height(nH).width(nW)
            .append('<div id="machineWrapDimmer"></div><div id="machineLoader"></div>');
    jQuery('#machineWrapDimmer').on('click', machineCloseB);
}

function machineStatusLoadOff(){
    var wrap = jQuery('#machineWrap');

    wrap.find('#machineLoader, #machineWrapDimmer').remove();
    wrap.children().unwrap();
}
