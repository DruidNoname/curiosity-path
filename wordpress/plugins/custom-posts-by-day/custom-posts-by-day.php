<?php
/**
 * Plugin Name: Custom Posts by Day API
 * Description: Добавляет REST API эндпоинт для получения постов по дню и месяцу за все годы
 * Version: 1.0.0
 * Author: Druid Adamantha + Deepseek
 * License: GPL v2 or later
 */

// Безопасность: предотвращаем прямой доступ к файлу
if (!defined('ABSPATH')) {
    exit;
}




// Хук для регистрации кастомного REST API маршрута
add_action('rest_api_init', 'register_custom_posts_by_day_endpoint');

function register_custom_posts_by_day_endpoint() {
    register_rest_route('custom/v1', '/posts-by-day/(?P<month>\d+)/(?P<day>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_posts_by_month_and_day',
        'permission_callback' => '__return_true', // Делаем публичным
        'args' => array(
            'month' => array(
                'required' => true,
                'validate_callback' => function($param) {
                    return is_numeric($param) && $param >= 1 && $param <= 12;
                },
                'sanitize_callback' => 'absint'
            ),
            'day' => array(
                'required' => true,
                'validate_callback' => function($param) {
                    return is_numeric($param) && $param >= 1 && $param <= 31;
                },
                'sanitize_callback' => 'absint'
            ),
            // НОВЫЙ ПАРАМЕТР: ID категорий для исключения
            'exclude_category_ids' => array(
                'required' => false,
                'description' => 'ID категорий для исключения (через запятую)',
                'type' => 'string',
                'validate_callback' => function($param) {
                    // Проверяем, что все значения - числа
                    $ids = array_map('trim', explode(',', $param));
                    foreach ($ids as $id) {
                        if (!is_numeric($id)) {
                            return false;
                        }
                    }
                    return true;
                },
                'sanitize_callback' => function($param) {
                    // Преобразуем строку в массив целых чисел
                    $ids = array_map('trim', explode(',', $param));
                    $ids = array_map('intval', $ids);
                    return implode(',', $ids); // Возвращаем строку для совместимости
                }
            ),
        ),
    ));
}

function get_posts_by_month_and_day($request) {
    $month = $request->get_param('month');
    $day = $request->get_param('day');
    
    $exclude_category_ids = $request->get_param('exclude_category_ids');
    $exclude_ids_array = array();

    if (!empty($exclude_category_ids)) {
        // Разбиваем строку с ID в массив
        $exclude_ids_array = array_map('intval', array_map('trim', explode(',', $exclude_category_ids)));
        // Удаляем пустые и нулевые значения
        $exclude_ids_array = array_filter($exclude_ids_array);
    }

    // Настраиваем диапазон лет (можно изменить под свои нужды)
    $start_year = 2010;
    $end_year = (int) date('Y'); // Текущий год
    
    // Создаём условия для date_query
    $date_conditions = array('relation' => 'OR');
    
    for ($year = $start_year; $year <= $end_year; $year++) {
        $date_conditions[] = array(
            'year' => $year,
            'month' => $month,
            'day' => $day,
        );
    }
    
    // Формируем аргументы для запроса
    $args = array(
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => -1, // Получить все посты
        'date_query' => $date_conditions,
        'orderby' => 'date',
        'order' => 'DESC',
        'ignore_sticky_posts' => true,
    );
    


    // НОВЫЙ КОД: добавляем исключение категорий, если есть ID
    if (!empty($exclude_ids_array)) {
        $args['tax_query'] = array(
            array(
                'taxonomy' => 'category',
                'field' => 'term_id',
                'terms' => $exclude_ids_array,
                'operator' => 'NOT IN', // Исключаем посты из этих категорий
            )
        );
    }

    // Выполняем запрос
    $query = new WP_Query($args);
    
    // Если постов нет - возвращаем пустой массив
    if (!$query->have_posts()) {
        return new WP_REST_Response(array(), 200);
    }
    
    // Формируем ответ
    $posts_data = array();
    
    while ($query->have_posts()) {
        $query->the_post();
        $post_id = get_the_ID();
        
        $posts_data[] = array(
            'id' => $post_id,
            'title' => array('rendered' => html_entity_decode(get_the_title())),
            'date' => get_the_date('c'),
            'modified' => get_the_modified_date('c'),
            'slug' => get_post_field('post_name', $post_id),
            'link' => get_permalink(),
            'excerpt' => array('rendered' => html_entity_decode(get_the_excerpt())),
        );
    }
    
    // Сбрасываем данные поста
    wp_reset_postdata();
    
    // Возвращаем ответ в формате JSON
    return new WP_REST_Response($posts_data, 200);
}
