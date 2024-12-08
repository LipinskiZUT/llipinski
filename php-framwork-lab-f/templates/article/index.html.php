<?php

/** @var \App\Model\Article[] $articles */
/** @var \App\Service\Router $router */

$title = 'Article List';
$bodyClass = 'index';

ob_start(); ?>
<h1>Lista artykułów</h1>

<a href="?action=article-create">Dodaj nowy artykuł</a>

<table>
    <thead>
    <tr>
        <th>ID</th>
        <th>Tytuł</th>
        <th>Autor</th>
        <th>Opublikowano</th>
        <th>Akcje</th>
    </tr>
    </thead>
    <tbody>
    <?php foreach ($articles as $article): ?>
        <td><?= htmlspecialchars($article->getId() ?? '') ?></td>
        <td><?= htmlspecialchars($article->getTitle() ?? '') ?></td>
        <td><?= htmlspecialchars($article->getAuthor() ?? '') ?></td>
        <td><?= htmlspecialchars($article->getPublishedAt() ?? 'Nieopublikowano') ?></td>
        <td>
            <a href="?action=article-show&id=<?= $article->getId() ?>">Pokaż</a>
            <a href="?action=article-edit&id=<?= $article->getId() ?>">Edytuj</a>
            <a href="?action=article-delete&id=<?= $article->getId() ?>"onclick="return confirm('Na pewno usunąć?');">Usuń</a>
        </td>
        </tr>
    <?php endforeach; ?>
    </tbody>
</table>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';