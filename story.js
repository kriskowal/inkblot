'use strict';

var Path = require('./path');

exports.Text = Text;

function Text(path, text, prev) {
    this.type = 'text';
    this.path = path;
    this.name = Path.toName(path);
    this.text = text;
    this.prev = prev;
}

Text.prototype.write = function write(story, next) {
    if (this.prev) {
        this.prev.write(story, this.name);
    }
    story[this.name] = {
        type: 'text',
        text: this.text,
        next: next
    };
};

exports.Option = Option;

function Option(path, text, prev) {
    this.type = 'option';
    this.path = path;
    this.name = Path.toName(path);
    this.text = text;
    this.prev = prev;
    this.branch = null;
}

Option.prototype.write = function write(story, next) {
    if (!this.branch) {
        this.branch = next;
    } else {
        if (this.prev) {
            this.prev.write(story, this.name);
        }
        story[this.name] = {
            type: 'option',
            label: this.text,
            keywords: [],
            branch: this.branch,
            next: next
        };
    }
};

exports.Options = Options;

function Options(path, ends, prev) {
    this.type = 'options';
    this.path = path;
    this.name = Path.toName(path);
    this.ends = ends;
    this.prev = prev;
}

Options.prototype.write = function write(story, next) {
    // write ends before prev to populate branches
    for (var i = 0; i < this.ends.length; i++) {
        var end = this.ends[i];
        end.write(story, next);
    }

    this.prev.write(story, this.name);

    story[this.name] = {
        type: 'prompt'
    };
};