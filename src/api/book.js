/**
 * @Author: Robby
 * @Date: 2021/11/21
 * @Filename: book.js
 * @Function: 新增电子书信息，和编辑电子书信息
 **/
import request from '@/utils/request'

export function bookCategoryList() {
  return request({
    url: '/book/category_list',
    method: 'get'
  })
}

export function createBook(book) {
  return request({
    url: '/book/create',
    method: 'post',
    data: book
  })
}

export function getBook(fileName) {
  return request({
    url: '/book/get',
    method: 'get',
    params: { fileName }
  })
}

export function updateBook(book) {
  return request({
    url: '/book/update',
    method: 'post',
    data: book
  })
}

export function listBook(listQuery) {
  return request({
    url: '/book/list',
    method: 'get',
    // headers: {'Content-Type': ''},
    // 由于listQuery是个对象，那么就不需要 {}包裹
    params: listQuery
  })
}

export function deleteBook(fileName) {
  return request({
    url: '/book/delete',
    method: 'delete',
    params: { fileName }
  })
}
