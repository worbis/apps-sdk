/*
 * Templates to support auto-generation of the Vodo app.
 *
 * Copyright(c) 2010 BitTorrent Inc.
 * License: ************
 *
 * Date: %date%
 * Version: %version%
 *
 */

Jaml.register('vodo.release.links', function(l) {
  li(a({ href: l.url }, l.type));
});

Jaml.register('vodo.release.nav', function(t) {
  li(a({ href: '#', cls: t }, t));
});

Jaml.register('vodo.release.more', function() {
  a({ href: '#', cls: 'more' }, 'more')
});

Jaml.register('vodo.release.detail.description', function(entry) {
  li({ cls: 'description' }, entry.description);
});

Jaml.register('vodo.release.detail.author', function(entry) {
  li({ cls: 'author' },
     ul({ cls: 'author-detail' },
        entry.author.name ?
          li({ cls: 'group' },h4('Name:'), p(entry.author.name)) : '',
        entry.author.location ?
          li({ cls: 'group' },h4('Location:'), p(entry.author.location)) : '',
        entry.author.bio ?
          li({ cls: 'group' },h4('Biography:'), p(entry.author.bio)) : '',
        entry.author.idea ?
          li({ cls: 'group' },h4('Next Idea:'), p(entry.author.idea)) : '',
        entry.message ?
          li({ cls: 'group' },h4('Message:'), p(entry.message)) : '' ));
});

Jaml.register('vodo.release.detail.donate', function(entry) {
  li({ cls: 'donate' },
    ul({ cls: 'donate-detail' },
       Jaml.render('vodo.release.donate.link', entry.donationtiers)));
});

Jaml.register('vodo.release.detail.comments', function(entry) {
  li({ cls: 'comments' },
    form('<textarea/>', input({ type: 'submit', value: 'Comment' })),
     ul(Jaml.render('vodo.release.comment', entry.comments.reverse())));
});

Jaml.register('vodo.release', function(entry) {
  var detail = _.reduce(
    ['description', 'author', 'comments', 'donate'], '', function(a, b) {
      return a + "\n" + Jaml.render(
        'vodo.release.detail.'+b, entry);
    });
  li({ cls: 'release' },
     div({ cls: 'overview group' },
         h3({ cls: 'title' }, entry.title),
         p({ cls: 'auth' }, "by ", entry.author.name),
         p({ cls: 'duration' }, vodo.format_seconds(
           entry.torrents[0].duration)),
         img({ src: entry.thumbnail, width: '64' }),
         p({ cls: 'short-description' },
           entry.description.slice(0, 64) + '...'),
         div({ cls: 'download' },
             div({ cls: 'date' },
                 entry.published.split(' ')[0]
                ),
             div({ cls: 'links' },
                 ul(li({ cls: 'download-button' },
                       button('Download')),
                    li({ cls: 'play-button' },
                       button('Play'))),
                 div({ cls: 'progressbar' }),
                 ul({ cls: 'links-toggle'},
                    Jaml.render('vodo.release.links', entry.torrents)
                   )
                )
            ),
         a({ cls: 'release-toggle' }, '+')
        ),
     div({ cls: 'detail group' },
        div({ cls: 'nav' },
            ul({ cls: '' },
                Jaml.render('vodo.release.nav',
                            [ 'Description', 'Author', 'Comments', 'Donate']))
           ),
        div({ cls: 'section' },
            ul({ cls: 'canvas' }, detail)
           )
        )
  );
});

Jaml.register('vodo.release.donate.link', function(don) {
  li(a({ href: don.url }, don.description));
});

Jaml.register('vodo.release.comment', function(comment) {
  li(h4('<strong>', comment.username, '</strong> wrote:'),
     p({ cls: 'comment-body' }, comment.text));
});
