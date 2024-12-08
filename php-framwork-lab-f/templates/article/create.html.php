<?php


/** @var \App\Service\Router $router */

$title = 'New Article';
$bodyClass = 'index';

ob_start(); ?>
<h1>Dodaj nowy artykuł</h1>

<form action="?action=article-create" method="post">
    <label for="title">Tytuł:</label>
    <input type="text" id="title" name="article[title]" required>

    <label for="body">Treść:</label>
    <textarea id="body" name="article[body]" rows="10" required></textarea>

    <label for="author">Autor:</label>
    <input type="text" id="author" name="article[author]" required>

    <label for="published_at">Data publikacji:</label>
    <input type="datetime-local" id="published_at" name="article[published_at]">

    <button type="submit">Dodaj artykuł</button>
</form>
<a href="?action=article-index">Powrót do listy</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';