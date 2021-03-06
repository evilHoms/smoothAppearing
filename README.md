# Бибилиотека анимаций для плавного появления элементов на экране.

## Состоит из: 

* css файл
* js файл

Для использования необходимо подключить js файл к проекту.
В css находятся все классы с анимациями, подключать не нужно.

Для подключения в качестве импортируемого модуля, в корень проекта импортировать по умолчанию
/exportModule/smoothAppearing.js 

## Использование:

Для инициализации нужно создать объект класса SmoothAppearing().

Для запуска анимации, к нужным элементам необходимо добавить класс с анимацией из css файла. После добавления классов нужным элементам, анимация запускается с помощью метода runAnimation(), класса SmoothAppearing().
Классы могут быть заданы, как и в html, так и в js, но анимация начнется только после вызова runAnimation().

Добавлена возможность запуска анимации по скроллу. Для этого вместо runAnimation необходимо вызвать runAnimationOnScroll(), после этого анимации элементов, которым заданы классы из css файла, будут активироваться только тогда, когда до элемента доходит скролл.

Пример запуска анимаций:

const anim = SmoothAppearing();

anim.runAnimation(500, 200);

Первый аргумент - время анимации, второй - задержка.
Можно не указывать. Значения по умолчанию: 1000, 500.

## Функционирование:

js скрипт ищет элементы, к которым были применены классы из css файла, после вычисляет их положение и в зависимости от класса, применяет к ним анимации. По завершению анимации, класс анимации удаляется, как и стили, которые анимация добавляла.

## Возможные ошибки:

Во избежании багов, не стоит применять к объектам, которые находятся в процессе анимирования другие анимации. (Исправлено с анимациями из данного модуля. Новая анимация запустится, только если элемент не находится в процессе анимирования).
Так же возможно неправильное поведение, если вы задавали положение top bottom left right : auto,
при подобном прошу сообщить.