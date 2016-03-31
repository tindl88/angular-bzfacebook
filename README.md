```javascript
angular
.module('myApp', ['ngFacebook'])
.config(config)
.controller('myCtrl', myCtrl);

function config($facebookProvider){
    $facebookProvider.setAppId('appId');
    $facebookProvider.setLanguage('vi_VN');
    $facebookProvider.setPermissions('email, publish_actions...');
    $facebookProvider.setVersion('v2.5');
    $facebookProvider.setCookie(false);
    $facebookProvider.setXfbml(false);
    $facebookProvider.redirect('link');
}

function myCtrl($scope, $facebook) {
    /**********************************************************
    Sửa lỗi không đăng nhập được bằng Chrome trên iOS.
    Lưu ý: Đăng ký params ?code&scope cho router
    **********************************************************/
    if($stateParams.code){
        console.log('Đăng nhập facebook thành công!');
    }
    /**********************************************************
    Lấy trạng thái đăng nhập
    **********************************************************/
    function facebookLoginStatus(){
        $facebook.getLoginStatus()
        .then(function(resp){
            console.log(resp);
        });
    }
    /**********************************************************
    Đăng nhập facebook
    **********************************************************/
    function facebookLogin() {
        $facebook.login()
        .then(function(resp){
            console.log('Đăng nhập facebook thành công!', resp);
        }, function(){
            console.log('Hủy đăng nhập facebook.');
        });
    }
    /**********************************************************
    Chia sẽ bài viết
    **********************************************************/
    function facebookUi() {
        $facebook.ui({
            href:'http://google.com'
        })
        .then(function(resp){
            console.log('Chia sẻ facebook thành công!', resp);
        }, function(){
            console.log('Hủy chia sẻ facebook.');
        });
    }
    /**********************************************************
    1. Lấy bài viết của user
    2. Đăng bài lên tường - Yêu cầu quyền 'publish_actions'
    3. Đăng ảnh lên tường - Yêu cầu quyền 'publish_actions'
    **********************************************************/
    function facebookApi(){
        $facebook.login()
        .then(function(resp){
            console.log('Đăng nhập facebook thành công!', resp);
            /* 1 */
            $facebook.api({
                link: '/me/feed',
                method: 'get',
                params: {
                    fields: 'message,full_picture,created_time,link',
                    limit: '10'
                }
            })
            .then(function(resp){
                console.log('Lấy dữ liệu thành công', resp);
            }, function(){
                console.log('Lỗi khi lấy dữ liệu facebook');
            });
            /* 2 */
            $facebook.api({
                link: '/me/feed',
                method: 'post',
                params: {
                    message: 'Nhập nội dung vào đây'
                }
            })
            .then(function(resp){
                console.log('Đăng bài viết lên facebook thành công', resp);
            }, function(){
                console.log('Lỗi khi đăng bài viết lên facebook');
            });
            /* 3 */
            $facebook.api({
                link: '/me/photos',
                method: 'post',
                params: {
                    caption: 'caption',
                    url: 'http://placehold.it/566x566'
                }
            })
            .then(function(resp){
                console.log('Đăng ảnh lên facebook thành công', resp);
            }, function(){
                console.log('Lỗi khi đăng ảnh lên facebook');
            });
        }, function(){
            console.log('Hủy đăng nhập facebook.');
        });
    }
});
```
