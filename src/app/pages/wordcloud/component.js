import React, { Component, PropTypes } from 'react';
import { Search } from 'bilo-ui';
import './style.scss';
import FuzzySearch from 'fuzzy-search';
import responses from './gta';
import Highlighter from 'react-highlight-words';
import { generateWordCloud } from './generate';
import WordCloud from 'react-d3-cloud';

const fontSizeMapper = word => Math.log2(word.value) * 5;
const rotate = word => 0;

export default class WordCloudPage extends Component {
    constructor(props) {
        super(props)
        this.searchResponses = this.searchResponses.bind(this);
        this.selectResponse = this.selectResponse.bind(this);
    }
    render() {
        return this.state ? (
            <div className='page page-padded'>
                <h1>Word Cloud</h1>
                <Search
                    placeholder='search responses...'
                    search={this.searchResponses}
                    select={this.selectResponse}
                    query={this.state.query}
                    suggestions={this.state.suggestions}
                    suggestionsOn={false}
                />
                <BilosWordCloud
                    wordcloud={this.state.wordcloud}
                    onClick={(e) => this.clickWord(e)} />
                <Suggestions
                    highlight={this.state.query}
                    onSelect={this.selectResponse}
                    suggestions={this.state.searchResults} />
            </div>
        ) : null
    }
    componentDidMount() {
        this.responsesToWordcloud();
        this.searcher = new FuzzySearch(responses, ['text', 'tagline'], {
            caseSensitive: false,
        });

        this.setState({
            query: '',
            suggestions: [],
            searchResults: []
        })
    }
    responsesToWordcloud(minMentions = 2, scale = 100) {
        let responseStrings =  responses.map( (r) => {
            return r.text
        })
        
        let words = generateWordCloud(responseStrings);
        let wordCloudData = []
        for( var key in words) {
            if(words[key] >= minMentions) {
            wordCloudData.push( { text: key, value: words[key] * scale})
            }
        }
        this.setState({
            ...this.state,
            wordcloud: wordCloudData
        })
    }
    selectResponse(tag, item) {
        console.log('Selected:', { item })
    }
    searchResponses(tag, query) {
        if (!query || !query.length) {
            this.setState({
                ...this.state,
                query,
                suggestions: [],
                searchResults: []
            })
            return;
        }

        let searchResult = this.searcher.search(query);
        let results = searchResult.map((item) => {
            return {
                label: `${item.person}: "${item.text}"`
            }
        })
        this.setState({
            ...this.state,
            query,
            suggestions: results,
            searchResults: searchResult
        })
        console.log(searchResult)
    }
    clickWord(e) {
        let word = e.target.innerHTML
        if (word[0] === '<') return;
        console.log('Clicked WordCloud', word)
        this.setState({
            ...this.state,
            query: word
        })
        this.searchResponses(undefined, word);
    }
}

export const Suggestions = (props, {highlight}) => {
    return (
        <div>
            {
            (props.suggestions || []).map((response, index) => {
                return (
                    <div key={index} className='response-card' onClick={() => {props.onSelect('something', response), console.log(props.query)}}>
                        <label>
                            <Highlighter highlightClassName='highlighting' searchWords={[props.highlight]} textToHighlight={`${response.name}`} />
                        </label>
                        <p style={{ fontStyle: 'italic' }}>
                            <Highlighter highlightClassName='highlighting' searchWords={[props.highlight]} textToHighlight={response.text} />
                        </p>
                    </div>
                )
            })
        }</div>
    )
}

export const BilosWordCloud = (props, {wordcloud}) => {
    return (
        props.wordcloud ? (
            <div className={props.className} onClick={props.onClick} style={props.style}>
                <WordCloud  
                    data={props.wordcloud}
                    fontSizeMapper={fontSizeMapper}
                    rotate={rotate}
                    />
            </div>
        ): null
    )
}