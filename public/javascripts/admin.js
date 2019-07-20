deleteProduct = (btn) => {
    //Dung DOM de lay gia tri _csrf va productId de dung async request guir len server khong load lai trang
    const productId = btn.parentElement.querySelector('[name=productId]').value;
    const _csrf = btn.parentElement.querySelector('[name=_csrf]').value;
    //Dung phuong thuc fecth != fetch data
    fetch(`/admin/product/${productId}`,
        {
            method: 'DELETE',
            headers: {
                'csrf-token': _csrf
            }
        }
    ).then(result => {
        return result.json()
    }).then(data => {
        //Tra ve massage va productId minh gui tu ben kia
        //xoa va cap nhat dom cua product co productId=productId
        //DUA VAO vi tri dom ta co công thức sau
        const productDelete = btn.closest('article');
        productDelete.remove();
    })
        .catch(err => {
            console.log(err)
        })
}